import { Aedes } from 'aedes'
import { createServer } from 'net'

export function startBroker( port: number ): Aedes {
  const aedes = new Aedes()
  const server = createServer( aedes.handle )

  server.listen( port, () => { console.log( `MQTT broker started and listening on port ${port}` ) } )

  return aedes
}