import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fjwt, { FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import { env } from './env'
import { authRoutes } from './modules/auth/auth.route'
import { entriesRoutes } from './modules/entries/entries.route'

const server = fastify()

// jwt
server.register(fjwt, {
  secret: env.JWT_SECRET,
})

server.addHook('preHandler', (req, _, next) => {
  req.jwt = server.jwt
  return next()
})

server.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.access_token

    if (!token) {
      return reply.status(400).send({ message: 'Authentication required' })
    }

    const decoded = request.jwt.verify<FastifyJWT['user']>(token)
    request.user = decoded
  },
)

// cookies
server.register(fCookie, {
  hook: 'preHandler',
  secret: env.COOKIE_SECRET,
})

server.get('/', () => {
  return { message: 'English Dictionary' }
})

server.register(entriesRoutes, {
  prefix: '/entries/en',
})

server.register(authRoutes, {
  prefix: '/auth',
})

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server running - PORT: ${env.PORT}`)
  })
