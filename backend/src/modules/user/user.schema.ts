import z from 'zod'

const getUserHistorySchema = z.object({
  limit: z.string(),
  cursor: z.string(),
  direction: z.enum(['next', 'prev']),
})

export type GetUserHistoryInput = z.infer<typeof getUserHistorySchema>

const getUserFavoriteSchema = z.object({
  limit: z.string(),
  cursor: z.string(),
  direction: z.enum(['next', 'prev']),
})

export type GetUserFavoriteInput = z.infer<typeof getUserFavoriteSchema>
