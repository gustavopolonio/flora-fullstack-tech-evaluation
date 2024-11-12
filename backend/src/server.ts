import fastify from 'fastify'
import { env } from './env'
import { entriesRoutes } from './routes/entries'

const server = fastify()

server.get('/', () => {
  return { message: 'English Dictionary' }
})

server.register(entriesRoutes, {
  prefix: '/entries',
})

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server running - PORT: ${env.PORT}`)
  })
