import { FastifyReply, FastifyRequest } from 'fastify'
import { api } from '../../lib/axios'
import { prisma } from '../../lib/prisma'
import {
  GetWordInput,
  GetWordsInput,
  FavoriteWordInput,
  UnFavoriteWordInput,
} from './entries.schema'

export async function getWords(
  request: FastifyRequest<{ Querystring: GetWordsInput }>,
) {
  const { search, limit = 20, cursor, direction } = request.query

  const where = {
    word: {
      contains: search,
    },
  }

  const [words, wordsCount] = await prisma.$transaction([
    prisma.word.findMany({
      take: direction === 'prev' ? -Number(limit) : Number(limit),
      where,
      orderBy: {
        word: 'asc',
      },
      ...(cursor
        ? {
            skip: 1,
            cursor: {
              id: cursor,
            },
          }
        : {}),
    }),
    prisma.word.count({
      where,
    }),
  ])

  const firstWord = words[0]
  const lastWord = words[words.length - 1]

  const hasNextPage =
    (
      await prisma.word.findMany({
        take: 1,
        skip: 1,
        cursor: { id: lastWord.id },
        orderBy: { word: 'asc' },
        where,
      })
    ).length > 0

  const hasPreviousPage =
    (
      await prisma.word.findMany({
        take: -1,
        skip: 1,
        cursor: { id: firstWord.id },
        orderBy: { word: 'asc' },
        where,
      })
    ).length > 0

  const wordsFormatted = words.map((item) => item.word)

  return {
    results: wordsFormatted,
    totalDocs: wordsCount,
    previous: firstWord.id,
    next: lastWord.id,
    hasNext: hasNextPage,
    hasPrev: hasPreviousPage,
  }
}

export async function getWord(
  request: FastifyRequest<{ Params: GetWordInput }>,
  reply: FastifyReply,
) {
  const { word } = request.params
  const user = request.user

  try {
    const response = await api.get(word)

    await prisma.$transaction(async (prisma) => {
      const wordData = await prisma.word.findFirst({
        where: {
          word,
        },
      })

      if (!wordData) {
        return reply
          .status(400)
          .send({ message: `Could not get word: ${word}` })
      }

      const historyAlreadyExists = await prisma.history.findUnique({
        where: {
          user_id_word_id: {
            user_id: user.id,
            word_id: wordData.id,
          },
        },
      })

      if (historyAlreadyExists) {
        await prisma.history.update({
          where: {
            user_id_word_id: {
              user_id: user.id,
              word_id: wordData.id,
            },
          },
          data: {
            created_at: new Date(),
          },
        })
      } else {
        await prisma.history.create({
          data: {
            user_id: user.id,
            word_id: wordData.id,
          },
        })
      }
    })

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

export async function favoriteWord(
  request: FastifyRequest<{ Params: FavoriteWordInput }>,
  reply: FastifyReply,
) {
  const { word } = request.params
  const user = request.user

  await prisma.$transaction(async (prisma) => {
    const wordData = await prisma.word.findUnique({
      where: {
        word,
      },
    })

    if (!wordData) {
      return reply.status(400).send({ message: `Could not find word: ${word}` })
    }

    const favoriteAlreadyExists = await prisma.favorite.findUnique({
      where: {
        user_id_word_id: {
          user_id: user.id,
          word_id: wordData.id,
        },
      },
    })

    if (favoriteAlreadyExists) {
      return reply
        .status(400)
        .send({ message: `Word: ${word} is already favorited` })
    }

    const favorite = await prisma.favorite.create({
      data: {
        user_id: user.id,
        word_id: wordData.id,
      },
    })

    return reply.send({ favoriteId: favorite.id })
  })
}

export async function unfavoriteWord(
  request: FastifyRequest<{ Params: UnFavoriteWordInput }>,
  reply: FastifyReply,
) {
  const { word } = request.params
  const user = request.user

  await prisma.$transaction(async (prisma) => {
    const wordData = await prisma.word.findUnique({
      where: {
        word,
      },
    })

    if (!wordData) {
      return reply.status(400).send({ message: `Could not find word: ${word}` })
    }

    const favoriteAlreadyExists = await prisma.favorite.findUnique({
      where: {
        user_id_word_id: {
          user_id: user.id,
          word_id: wordData.id,
        },
      },
    })

    if (!favoriteAlreadyExists) {
      return reply
        .status(400)
        .send({ message: `Word: ${word} isn't favorited` })
    }

    await prisma.favorite.delete({
      where: {
        user_id_word_id: {
          user_id: user.id,
          word_id: wordData.id,
        },
      },
    })

    return reply.status(204).send()
  })
}
