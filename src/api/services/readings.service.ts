// Mongo
import { InsertOneResult, WithId } from 'mongodb'
// DB
import { getReadingsCollection, SensorReading, SensorType } from '../../db/collections.js'

export interface PaginationOptions {
  limit: number
  skip: number
}

export interface SensorReadingsOptions extends PaginationOptions {
  sensorId: string
  from?: string
  to?: string
}

export async function getAllReadings( { limit, skip }: PaginationOptions ): Promise< WithId< SensorReading >[] > {
  const collection = await getReadingsCollection()

  return collection
    .find( {} )
    .sort( { timestamp: -1 } )
    .skip( skip )
    .limit( limit )
    .toArray()
}

export async function getReadingsBySensor( { sensorId, from, to, limit, skip }: SensorReadingsOptions ): Promise< WithId< SensorReading >[] > {
  const filter: Record< string, unknown > = { sensorId }

  if( from || to ) {
    const timestampFilter: Record< string, Date > = {}
    if( from ) timestampFilter.$gte = new Date( from )
    if( to ) timestampFilter.$lte = new Date( to )
    filter.timestamp = timestampFilter
  }

  const collection = await getReadingsCollection()

  return collection
    .find( filter )
    .sort( { timestamp: -1 } )
    .skip( skip )
    .limit( limit )
    .toArray()
}

export async function getReadingsByType( type: SensorType, { limit, skip }: PaginationOptions ): Promise< WithId< SensorReading >[] > {
  const collection = await getReadingsCollection()

  return collection
    .find( { type } )
    .sort( { timestamp: -1 } )
    .skip( skip )
    .limit( limit )
    .toArray()
}

export async function createReading( reading: SensorReading ): Promise< InsertOneResult< SensorReading > > {
  const collection = await getReadingsCollection()

  return collection.insertOne( reading )
}
