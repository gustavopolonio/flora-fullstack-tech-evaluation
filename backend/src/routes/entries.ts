import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { api } from '../lib/axios'

export async function entriesRoutes(app: FastifyInstance) {
  app.get('/en/:word', async (request, reply) => {
    const getWordParamsSchema = z.object({
      word: z.string(),
    })

    const { word } = getWordParamsSchema.parse(request.params)

    try {
      const response = await api.get(word)
      return { data: response.data }
    } catch (err) {
      return reply.status(400).send({ message: `Could not get word: ${word}` })
    }
  })
}
