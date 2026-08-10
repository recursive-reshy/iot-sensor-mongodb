// Mongo
import { Collection, ObjectId } from 'mongodb'
// DB
import { getDatabase } from './client.js'

export type SensorType = 'motion' | 'door' | 'temperature'

export interface SensorReading {
  _id?: ObjectId
  sensorId: string // "M003", "T002", "D001"
  type: SensorType
  value: string // "ON" | "OFF" | "OPEN" | "CLOSE" | numeric temp as string
  timestamp: Date
  activityLabel?: string // optional, sparse — CASAS activity annotation
}

export function getReadingsCollection(): Collection< SensorReading > {
  return getDatabase().collection< SensorReading >( 'readings' )
}