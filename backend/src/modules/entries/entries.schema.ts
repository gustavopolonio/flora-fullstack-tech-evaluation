import z from 'zod'

const getWordSchema = z.object({
  word: z.string(),
})

export type GetWordInput = z.infer<typeof getWordSchema>

const saveWordAsFavoritechema = z.object({
  word: z.string(),
})

export type SaveWordAsFavoriteInput = z.infer<typeof saveWordAsFavoritechema>
