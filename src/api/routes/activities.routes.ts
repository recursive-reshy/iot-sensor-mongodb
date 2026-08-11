// Express
import { Router } from 'express'
// Controllers
import { listActivities } from '../controllers/activities.controller.js'

export const activitiesRouter: Router = Router()

activitiesRouter.get( '/activities', listActivities )
