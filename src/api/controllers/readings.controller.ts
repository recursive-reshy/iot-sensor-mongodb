// Express
import { Request, Response } from 'express'
// DB
import { SensorReading, SensorType } from '../../db/collections.js'
// Services
import {
  getAllReadings,
  getReadingsBySensor,
  getReadingsByType,
  createReading,
} from '../services/readings.service.js'

export async function listReadings( { query }: Request, res: Response ): Promise< void > {
  try {
    const limit = Number( query.limit ) || 50
    const skip = Number( query.skip ) || 0

    const readings = await getAllReadings( { limit, skip } )

    res.status( 200 ).json( { readings, limit, skip, count: readings.length } )
  } catch ( error ) {
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}

export async function listReadingsBySensor( { query, params }: Request, res: Response ): Promise< void > {
  try {
    const sensorId = String( params.sensorId )
    const limit = Number( query.limit ) || 50
    const skip = Number( query.skip ) || 0
    const from = query.from ? String( query.from ) : undefined
    const to = query.to ? String( query.to ) : undefined

    const readings = await getReadingsBySensor( { sensorId, from, to, limit, skip } )

    res.status( 200 ).json( { sensorId, readings, limit, skip, count: readings.length } )
  } catch ( error ) {
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}

export async function listReadingsByType( { query, params }: Request, res: Response ): Promise< void > {
  try {
    const type = String( params.type ) as SensorType
    const limit = Number( query.limit ) || 50
    const skip = Number( query.skip ) || 0

    const readings = await getReadingsByType( type, { limit, skip } )

    res.status( 200 ).json( { type, readings, limit, skip, count: readings.length } )
  } catch ( error ) {
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}

export async function addReading( { body }: Request, res: Response ): Promise< void > {
  try {
    const { sensorId, type, value, timestamp, activityLabel }: SensorReading = body

    if( !sensorId || !type || !value || !timestamp ) {
      res.status( 400 ).json( { error: 'Missing required fields' } )
      return
    }

    const result = await createReading( {
      sensorId,
      type,
      value,
      timestamp: new Date( timestamp ),
      ...( activityLabel && { activityLabel } )
    } )

    res.status( 201 ).json( { message: 'Reading created', readingId: result.insertedId } )
  } catch ( error ) {
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
