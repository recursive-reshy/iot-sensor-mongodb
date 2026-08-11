// Mongo
import { WithId } from 'mongodb'
// DB
import { getReadingsCollection, SensorReading } from '../../db/collections.js'
// Services
import { PaginationOptions } from './readings.service.js'

export async function getActivities( { limit, skip }: PaginationOptions ): Promise< WithId< SensorReading >[] > {
  const collection = await getReadingsCollection()

  return collection
    .find( { activityLabel: { $exists: true } } )
    .sort( { timestamp: -1 } )
    .skip( skip )
    .limit( limit )
    .toArray()
}
