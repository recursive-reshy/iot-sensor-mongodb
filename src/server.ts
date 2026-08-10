// Express
import express, { Express } from 'express'
// DB
import { connectToDatabase, ensureIndexes } from './db/client.js'

// App
const app: Express = express()
const port = process.env.PORT || 3000

// Middleware
app.use( express.json() )

app.listen( port, async () => {
  try {
    const db = await connectToDatabase()
    await ensureIndexes( db )
    console.log( `Server is running on port ${ port }` )
  } catch (error) {
    console.error( 'Error starting server:', error )
  }
} )