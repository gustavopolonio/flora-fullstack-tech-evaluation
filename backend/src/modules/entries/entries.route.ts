import { FastifyInstance } from 'fastify'
import { getWord, getWords, saveWordAsFavorite } from './entries.controller'

export async function entriesRoutes(app: FastifyInstance) {
  app.get('/en', getWords)
  app.get('/en/:word', getWord)
  app.post('/en/:word/favorite', saveWordAsFavorite)

  // Route used to populate words table from english-words API
  // app.post('/en/populate-words-table', populateWordsTable)
}
