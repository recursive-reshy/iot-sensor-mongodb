// Express
import { Router } from 'express'
// Controllers
import {
  listReadings,
  listReadingsBySensor,
  listReadingsByType,
  addReading,
} from '../controllers/readings.controller.js'

export const readingsRouter: Router = Router()

readingsRouter.get( '/readings', listReadings )
readingsRouter.get( '/sensors/:sensorId/readings', listReadingsBySensor )
readingsRouter.get( '/sensors/type/:type', listReadingsByType )
readingsRouter.post( '/readings', addReading )
