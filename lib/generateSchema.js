import { z } from 'zod'

export const generateRecipeSchem = z.object({
    meal: z
    .string()
    .trim()
    .min(4, "Your meal name should be at lease four alphabets.")
    .max(50, "Your meal name must not be longer than fifty alphabets.")
  })
