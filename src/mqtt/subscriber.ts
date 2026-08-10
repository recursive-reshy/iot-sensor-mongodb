import mqtt from 'mqtt'
import { getReadingsCollection, SensorReading } from '../db/collections.js'

export function startSubscriber( brokenUrl: string ): void {
  const client = mqtt.connect( brokenUrl )

  client.on( 'connect', () => {
    console.log( `Subscriber connected to broker at ${brokenUrl}` )
    client.subscribe( 'iothings/sensors/+', ( error ) => console.error( `Error subscribing to topic: ${ error }` ) )
  } )

  client.on( 'message', async ( topic, payload ) => {
    try {
      const reading: SensorReading = JSON.parse( payload.toString() )

      reading.timestamp = new Date( reading.timestamp )

      const readingsCollection = await getReadingsCollection()
      await readingsCollection.insertOne( reading )
    } catch ( error ) {
      console.error(  `Error processing message from topic ${topic}: ${error}` )
    }
  } )
}