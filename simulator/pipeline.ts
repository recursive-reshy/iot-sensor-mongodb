// System
import fs from 'fs'
import path from 'path'
// DB
import { connectToDatabase } from '../src/db/client.js'
import { SensorReading, SensorType } from '../src/db/collections.js'
// MQTT
import mqtt from 'mqtt'

const RAW_FILE = path.resolve( import.meta.dirname, 'raw/aruba-7day.txt' )
const MQTT_URL = `mqtt://localhost:${ process.env.MQTT_PORT || 1883 }`

const SENSOR_TYPE_MAP: Record< string, SensorType > = {
  M: 'motion',
  D: 'door',
  T: 'temperature',
}

const parseLine = ( line: string ): SensorReading | null => {
  const parts = line.trim().split( /\s+/ ) // Split by whitespace

  if( parts.length < 4 ) return null

  const [ date, time, sensorId, value, ...rest ] = parts

  const prefix = sensorId[ 0 ]
  const type = SENSOR_TYPE_MAP[ prefix ]

  if( !type ) return null // Skip unknown sensor types

  const timestamp = new Date( `${ date }T${ time }Z` ) // Combine date and time into a single timestamp

  if( isNaN( timestamp.getTime() ) ) return null // Skip invalid dates

  const activityLabel = rest.length > 0 ? rest.join( ' ' ) : undefined

  return {
    sensorId,
    type,
    value,
    timestamp,
    activityLabel,
  }
}

const dropExistingReadings = async (): Promise< void > => {
  console.log( 'Connecting to MongoDB to clear existing readings' )
  const db = await connectToDatabase()
  const result = await db.collection( 'readings' ).deleteMany( {} )
  console.log( `Cleared ${ result.deletedCount } existing readings` )
}

const publishReadings = async (): Promise< void > => {
  const raw = fs.readFileSync( RAW_FILE, 'utf-8' )
  const lines = raw.split( '\n' ).filter( ( line ) => line.trim().length > 0 )

  const readings = lines
    .map( parseLine )
    .filter( ( reading ): reading is SensorReading => reading !== null )

  console.log( `Parsed ${ readings.length } of ${ lines.length } raw lines` )

  const client = mqtt.connect( MQTT_URL )

  await new Promise< void >( ( resolve, reject ) => {
    client.on( 'connect', () => {
      console.log( `Pipeline connected to broker at ${ MQTT_URL }` )
      resolve()
    } )
    client.on( 'error', ( error ) => reject( error ) )
  } )

  await Promise.all(
    readings.map(
      ( reading ) =>
        new Promise< void >( ( resolve, reject ) => {
          const topic = `iothings/sensors/${ reading.type }`
          client.publish( topic, JSON.stringify( reading ), ( error ) => {
            if ( error ) reject( error )
            else resolve()
          } )
        } )
    )
  )

  console.log( `Published ${ readings.length } readings` )

  client.end()
}

const main = async (): Promise< void > => {
  await dropExistingReadings()
  await publishReadings()

  process.exit( 0 )
}

main().catch( error => {
  console.error( 'Error in simulator pipeline:', error )
  process.exit( 1 )
} )