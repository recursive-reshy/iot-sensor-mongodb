// Express
import { Router, Request, Response } from 'express'
// DB
import { getReadingsCollection } from '../../db/collections.js'

export const activitiesRouter: Router = Router()

activitiesRouter.get( '/activities', async ( { query: { limit, skip } }: Request, res: Response ) => {
  const collection = await getReadingsCollection()
  const activities = await collection
    .find( { activityLabel: { $exists: true } } )
    .sort( { timestamp: -1 } )
    .skip( Number( skip ) || 0 )
    .limit( Number( limit ) || 50 )
    .toArray()

  res.status( 200 ).json( { count: activities.length, limit, skip, activities } )
} )