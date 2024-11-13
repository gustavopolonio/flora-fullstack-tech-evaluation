import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma'
import { GetUserFavoriteInput, GetUserHistoryInput } from './user.schema'

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const userPayload = request.user

  const user = await prisma.user.findUnique({
    where: {
      id: userPayload.id,
    },
  })

  if (!user) {
    return reply.status(400).send({ message: 'User not found' })
  }

  return {
    name: user.name,
    email: user.email,
  }
}

export async function getUserHistory(
  request: FastifyRequest<{ Querystring: GetUserHistoryInput }>,
) {
  const { limit = 5, cursor, direction } = request.query
  const user = request.user

  const where = {
    user_id: user.id,
  }

  const [history, historyCount] = await prisma.$transaction([
    prisma.history.findMany({
      take: direction === 'prev' ? -Number(limit) : Number(limit),
      where,
      include: {
        word: true,
      },
      orderBy: {
        word: { word: 'asc' },
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
    prisma.history.count({
      where,
    }),
  ])

  const firstHistory = history[0]
  const lastHistory = history[history.length - 1]

  const hasNextPage =
    (
      await prisma.history.findMany({
        take: 1,
        skip: 1,
        cursor: { id: lastHistory.id },
        orderBy: { word: { word: 'asc' } },
        where,
      })
    ).length > 0

  const hasPreviousPage =
    (
      await prisma.history.findMany({
        take: -1,
        skip: 1,
        cursor: { id: firstHistory.id },
        orderBy: { word: { word: 'asc' } },
        where,
      })
    ).length > 0

  const historyFormatted = history.map((item) => ({
    word: item.word.word,
    added: item.created_at,
  }))

  return {
    results: historyFormatted,
    totalDocs: historyCount,
    previous: firstHistory.id,
    next: lastHistory.id,
    hasNext: hasNextPage,
    hasPrev: hasPreviousPage,
  }
}

export async function getUserFavorites(
  request: FastifyRequest<{ Querystring: GetUserFavoriteInput }>,
) {
  const { limit = 5, cursor, direction } = request.query
  const user = request.user

  const where = {
    user_id: user.id,
  }

  const [favorite, favoriteCount] = await prisma.$transaction([
    prisma.favorite.findMany({
      take: direction === 'prev' ? -Number(limit) : Number(limit),
      where,
      include: {
        word: true,
      },
      orderBy: {
        word: { word: 'asc' },
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
    prisma.favorite.count({
      where,
    }),
  ])

  const firstFavorite = favorite[0]
  const lastFavorite = favorite[favorite.length - 1]

  const hasNextPage =
    (
      await prisma.favorite.findMany({
        take: 1,
        skip: 1,
        cursor: { id: lastFavorite.id },
        orderBy: { word: { word: 'asc' } },
        where,
      })
    ).length > 0

  const hasPreviousPage =
    (
      await prisma.favorite.findMany({
        take: -1,
        skip: 1,
        cursor: { id: firstFavorite.id },
        orderBy: { word: { word: 'asc' } },
        where,
      })
    ).length > 0

  const favoriteFormatted = favorite.map((item) => ({
    word: item.word.word,
    added: item.created_at,
  }))

  return {
    results: favoriteFormatted,
    totalDocs: favoriteCount,
    previous: firstFavorite.id,
    next: lastFavorite.id,
    hasNext: hasNextPage,
    hasPrev: hasPreviousPage,
  }
}
