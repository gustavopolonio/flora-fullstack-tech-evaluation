import z from 'zod'

const getWordsSchema = z.object({
  search: z.string(),
  limit: z.string(),
  cursor: z.string(),
  direction: z.enum(['next', 'prev']),
})

export type GetWordsInput = z.infer<typeof getWordsSchema>

const getWordSchema = z.object({
  word: z.string(),
})

export type GetWordInput = z.infer<typeof getWordSchema>

const favoriteWordSchema = z.object({
  word: z.string(),
})

export type FavoriteWordInput = z.infer<typeof favoriteWordSchema>

const unfavoriteWordSchema = z.object({
  word: z.string(),
})

export type UnFavoriteWordInput = z.infer<typeof unfavoriteWordSchema>
