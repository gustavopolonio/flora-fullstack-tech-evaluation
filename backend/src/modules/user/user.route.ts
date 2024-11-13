import { FastifyInstance } from 'fastify'
import { getUser, getUserHistory, getUserFavorites } from './user.controller'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [app.authenticate] }, getUser)
  app.get('/history', { preHandler: [app.authenticate] }, getUserHistory)
  app.get('/favorites', { preHandler: [app.authenticate] }, getUserFavorites)
}
