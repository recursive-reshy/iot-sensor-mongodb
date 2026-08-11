import mqtt from 'mqtt'
import { getReadingsCollection, SensorReading } from '../db/collections.js'

export function startSubscriber( brokerUrl: string ): void {
  console.log( `Starting MQTT subscriber to broker at ${ brokerUrl }` )
  const client = mqtt.connect( brokerUrl )

  client.on( 'connect', () => {
    console.log( `Subscriber connected to broker at ${ brokerUrl }` )
    client.subscribe( 'iothings/sensors/+', ( error, granted ) => {
      if( error ) console.error( `Error subscribing to topic: ${ error }` )
      else console.log( `Subscribed ${ JSON.stringify( granted ) }` )
    } )
  } )

  client.on( 'error', ( error ) => {
    console.error( `MQTT client error: ${ error }` )
  } )

  client.on( 'reconnect', () => {
    console.log( 'MQTT client attempting to reconnect...' )
  } )

  client.on( 'close', () => {
    console.log( 'MQTT client connection closed' )
  } )

  client.on( 'message', async ( topic, payload ) => {
    try {
      const reading: SensorReading = JSON.parse( payload.toString() )

      reading.timestamp = new Date( reading.timestamp )

      const readingsCollection = await getReadingsCollection()
      await readingsCollection.insertOne( reading )

      console.log( `Inserted reading from ${ topic }:`, reading )
    } catch ( error ) {
      console.error(  `Error processing message from topic ${ topic }: ${ error }` )
    }
  } )
}