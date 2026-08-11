// Express
import express, { Express } from 'express'
// DB
import { connectToDatabase, ensureIndexes } from './db/client.js'
// MQTT
import { startBroker } from './mqtt/broker.js'
import { startSubscriber } from './mqtt/subscriber.js'
// APIs
import { apiRouter } from './api/index.js'

// App
const app: Express = express()
const port = process.env.PORT || 3000

// Middleware
app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )
app.use( '/api', apiRouter )

app.get( '/health', ( _, res ) => {
  res.status( 200 ).json( {
    status: 'ok',
    timestamp: new Date().toISOString(),
  } )
} )

app.listen( port, async () => {
  try {
    const db = await connectToDatabase()
    await ensureIndexes( db )

    await startBroker( Number( process.env.MQTT_PORT ) || 1883 )
    startSubscriber( `mqtt://localhost:${ process.env.MQTT_PORT || 1883 }` )
    console.log( `Server is running on port ${ port }` )
  } catch (error) {
    console.error( 'Error starting server:', error )
  }
} )