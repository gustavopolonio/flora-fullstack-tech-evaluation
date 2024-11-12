import { FastifyReply, FastifyRequest } from 'fastify'
import bcrypt from 'bcrypt'
import { SigninInput, SignupInput } from './auth.schema'
import { prisma } from '../../lib/prisma'

const SALT_ROUNDS = 10

export async function signup(
  request: FastifyRequest<{ Body: SignupInput }>,
  reply: FastifyReply,
) {
  const { name, email, password } = request.body

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (user) {
    return reply
      .status(400)
      .send({ message: 'This email is already been used' })
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    })

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    }

    const token = request.jwt.sign(payload)

    reply.setCookie('access_token', token, {
      path: '/',
      httpOnly: true,
      secure: true,
    })

    return {
      id: user.id,
      name: user.name,
      token: `Bearer ${token}`,
    }
  } catch (err) {
    console.log(err)
    return reply.status(400).send({ message: 'Could not create user' })
  }
}

export async function signin(
  request: FastifyRequest<{ Body: SigninInput }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  const isPasswordMatch =
    user && (await bcrypt.compare(password, user.password))

  if (!user || !isPasswordMatch) {
    return reply.status(400).send({ message: 'Invalid email or password' })
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  }

  const token = request.jwt.sign(payload)

  reply.setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: true,
  })

  return {
    id: user.id,
    name: user.name,
    token: `Bearer ${token}`,
  }
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token')
  return reply.status(204).send()
}
