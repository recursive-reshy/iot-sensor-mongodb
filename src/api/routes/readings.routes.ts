// Express
import { Request, Response, Router } from 'express'
// DB
import { getReadingsCollection, SensorReading } from '../../db/collections.js'

export const readingsRouter: Router = Router()

readingsRouter.get( '/readings', async ( { query: { limit, skip } }: Request, res: Response ) => {
  try {
    const collection = await getReadingsCollection()
    const readings = await collection
      .find( {} )
      .sort( { timestamp: -1 } )
      .skip( Number( skip ) || 0 )
      .limit( Number( limit ) || 50 )
      .toArray()
      
    res.status( 200 ).json( { readings, limit, skip, count: readings.length } )
  } catch (error) {
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
} )

readingsRouter.get( '/sensors/:sensorId/readings', async ( { query: { limit, skip, from, to }, params: { sensorId } }: Request, res: Response ) => {
  try {
    const filter: Record< string, unknown > = { sensorId }
    
    if( from || to ) {
      const timestampFilter: Record< string, Date > = {}
      if( from ) timestampFilter.$gte = new Date( String( from )  )
      if( to ) timestampFilter.$lte = new Date( String( to ) )
      filter.timestamp = timestampFilter
    }

    const collection = await getReadingsCollection()
    const readings = await collection
      .find( filter )
      .sort( { timestamp: -1 } )
      .skip( Number( skip ) || 0 )
      .limit( Number( limit ) || 50 )
      .toArray()

    res.status( 200 ).json( { sensorId, readings, limit, skip, count: readings.length } )
  } catch (error) {
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
} )

readingsRouter.post( '/readings', async ( { body }: Request, res: Response ) => {
  try {
    const { sensorId, type, value, timestamp, activityLabel }: SensorReading = body

    if( !sensorId || !type || !value || !timestamp ) {
      return res.status( 400 ).json( { error: 'Missing required fields' } )
    }

    const collection = await getReadingsCollection()

    const result = await collection
      .insertOne( { 
        sensorId, 
        type, 
        value, 
        timestamp: new Date( timestamp ),
        ...(activityLabel && { activityLabel } )
      } )

    res.status( 201 ).json( { message: 'Reading created', readingId: result.insertedId } )
  } catch (error) {
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
} )