import { FastifyReply, FastifyRequest } from 'fastify'
import { api } from '../../lib/axios'
import { GetWordInput, SaveWordAsFavoriteInput } from './entries.schema'
import { prisma } from '../../lib/prisma'

export async function getWord(
  request: FastifyRequest<{ Params: GetWordInput }>,
  reply: FastifyReply,
) {
  const { word } = request.params

  try {
    const response = await api.get(word)
    return { data: response.data }
  } catch (err) {
    return reply.status(400).send({ message: `Could not get word: ${word}` })
  }
}

export async function populateWordsTable(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json',
    )
    if (!response.ok) throw new Error('Could not download JSON file')

    const words = await response.json()

    await prisma.word.createMany({
      data: Object.keys(words).map((word) => ({
        word,
      })),
    })

    return reply.send({ message: 'Words table populated successfully' })
  } catch (err) {
    console.log(err)
  }
}

export async function saveWordAsFavorite(
  request: FastifyRequest<{ Params: SaveWordAsFavoriteInput }>,
  reply: FastifyReply,
) {
  const { word } = request.params

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
}
