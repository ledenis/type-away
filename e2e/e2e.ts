import * as ioClient from 'socket.io-client'
import { bootstrapServer } from '../src/server'

shouldTypeLs()

function shouldTypeLs() {
  const port = '3001'
  const shutdownServerFn = bootstrapServer({ TA_PORT: port })
  const client = ioClient.connect(`http://localhost:${port}`)

  client.emit('type', 'ls爱')
  client.emit('key', 'BackSpace')
  client.emit('key', 'Return')

  setTimeout(() => {
    client.close()
    shutdownServerFn()
  }, 2000)
}
