import z from 'zod'

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export type signupInput = z.infer<typeof signupSchema>

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type signinInput = z.infer<typeof signinSchema>
