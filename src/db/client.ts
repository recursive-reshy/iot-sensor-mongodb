import { MongoClient, Db } from 'mongodb'
import { SensorReading } from './collections.js'

let client: MongoClient
let db: Db

export async function connectToDatabase(): Promise< Db > {
  if( !process.env.MONGODB_URI ) throw new Error( 'MONGODB_URI is not defined' )
  console.log( 'Connecting to MongoDB' )

  try {
    client = new MongoClient( process.env.MONGODB_URI )
    
    await client.connect()

    db = client.db( process.env.MONGODB_DB_NAME )
    console.log( `Connected to ${ process.env.MONGODB_DB_NAME }` )

    return db
  } catch (error) {
    console.error( 'Error connecting to database:', error )
    throw error
  }  
}

// Ensure indexes for the readings collection for efficient queries
export async function ensureIndexes( db: Db ): Promise< void > {
  console.log( 'Ensuring indexes for readings collection' )
  const readings = db.collection< SensorReading >( 'readings' )

  await readings.createIndex( { sensorId: 1, timestamp: -1 } )
  await readings.createIndex( { type: 1 } )
  await readings.createIndex( { activityLabel: 1 } )
}

export function getDatabase(): Db {
  if( !db ) throw new Error( 'Database not connected. Call connectToDatabase first.' )
  return db
}

export async function closeDatabaseConnection(): Promise< void > {
  if( client ) {
    await client.close()
    console.log( 'Database connection closed' )
  }
}