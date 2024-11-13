import { FastifyInstance } from 'fastify'
import {
  getWord,
  getWords,
  favoriteWord,
  unfavoriteWord,
} from './entries.controller'

export async function entriesRoutes(app: FastifyInstance) {
  app.get('/', getWords)
  app.get('/:word', { preHandler: [app.authenticate] }, getWord)
  app.post('/:word/favorite', { preHandler: [app.authenticate] }, favoriteWord)
  app.delete(
    '/:word/unfavorite',
    { preHandler: [app.authenticate] },
    unfavoriteWord,
  )

  // Route used to populate words table from english-words API
  // app.post('/en/populate-words-table', populateWordsTable)
}
