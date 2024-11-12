import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { api } from '../lib/axios'
import { prisma } from '../lib/prisma'

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

  app.post('/en/:word/favorite', async (request, reply) => {
    const getWordParamsSchema = z.object({
      word: z.string(),
    })

    const { word } = getWordParamsSchema.parse(request.params)

    const wordData = await prisma.word.findUnique({
      where: {
        word,
      },
    })

    if (!wordData) {
      return reply
        .status(400)
        .send({ message: `Could not favorite word: ${word}` })
    }

    const favorite = await prisma.favorite.create({
      data: {
        user_id: 'id_test',
        word_id: wordData.id,
      },
    })

    return { favoriteId: favorite.id }
  })
}
