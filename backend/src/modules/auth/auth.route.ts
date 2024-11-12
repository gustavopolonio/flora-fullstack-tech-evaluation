import { FastifyInstance } from 'fastify'
import { logout, signin, signup } from './auth.controller'

export async function authRoutes(app: FastifyInstance) {
  app.post('/signup', signup)
  app.post('/signin', signin)
  app.delete('/logout', { preHandler: [app.authenticate] }, logout)
}
