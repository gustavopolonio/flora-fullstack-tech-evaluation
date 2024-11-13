import { FastifyInstance } from 'fastify'
import { getUser } from './user.controller'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [app.authenticate] }, getUser)
}
