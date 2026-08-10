import express, { Express } from 'express'

// App
const app: Express = express()
const port = process.env.PORT || 3000

// Middleware
app.use( express.json() )

app.listen( port, () => { console.log( `Server is running on port ${ port }` ) } )