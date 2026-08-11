import { Aedes } from 'aedes'
import { createServer } from 'net'

export async function startBroker( port: number ): Promise< Aedes > {
  const aedes = await Aedes.createBroker()
  const server = createServer( aedes.handle )

  return new Promise( ( resolve ) => {
    server.listen( port, () => { 
      console.log( `MQTT broker started and listening on port ${port}` )
      resolve( aedes )
    } )
  } )
}