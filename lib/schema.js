import { z } from 'zod'

export const recipeSchema = z.object({
  summmary: z.string().min(10).max(200),
  steps: z.array(z.string()).length(5)
})