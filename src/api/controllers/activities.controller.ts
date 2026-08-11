// Express
import { Request, Response } from 'express'
// Services
import { getActivities } from '../services/activities.service.js'

export async function listActivities( { query }: Request, res: Response ): Promise< void > {
  try {
    const limit = Number( query.limit ) || 50
    const skip = Number( query.skip ) || 0

    const activities = await getActivities( { limit, skip } )

    res.status( 200 ).json( { count: activities.length, limit, skip, activities } )
  } catch ( error ) {
    res.status( 500 ).json( { error: 'Internal Server Error' } )
  }
}
