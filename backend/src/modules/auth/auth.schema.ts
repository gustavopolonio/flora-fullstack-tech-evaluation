import z from 'zod'

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export type SignupInput = z.infer<typeof signupSchema>

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type SigninInput = z.infer<typeof signinSchema>
