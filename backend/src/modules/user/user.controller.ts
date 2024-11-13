import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma'

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
