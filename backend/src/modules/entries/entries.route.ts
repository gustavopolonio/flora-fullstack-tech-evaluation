import { FastifyInstance } from 'fastify'
import { getWord, getWords, saveWordAsFavorite } from './entries.controller'

export async function entriesRoutes(app: FastifyInstance) {
  app.get('/en', getWords)
  app.get('/en/:word', { preHandler: [app.authenticate] }, getWord)
  app.post(
    '/en/:word/favorite',
    { preHandler: [app.authenticate] },
    saveWordAsFavorite,
  )

  // Route used to populate words table from english-words API
  // app.post('/en/populate-words-table', populateWordsTable)
}
