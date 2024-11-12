import { FastifyInstance } from 'fastify'
import { getWord, saveWordAsFavorite } from './entries.controller'

export async function entriesRoutes(app: FastifyInstance) {
  app.get('/en/:word', getWord)
  app.post('/en/:word/favorite', saveWordAsFavorite)
}
