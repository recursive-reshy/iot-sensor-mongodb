// Express
import { Router } from 'express'
// Routes
import { readingsRouter } from './routes/readings.routes.js'
import { activitiesRouter } from './routes/activities.routes.js'

export const apiRouter: Router = Router()

apiRouter.use( readingsRouter )
apiRouter.use( activitiesRouter )