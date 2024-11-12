import fastify from 'fastify'
import { env } from './env'

const server = fastify()

server.get('/ping', async () => {
  return 'pong\n'
})

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server running - PORT: ${env.PORT}`)
  })
