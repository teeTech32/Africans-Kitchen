import { z } from 'zod'

export const generateRecipeSchem = z.object({
  meal: z.string()
         .trim()
         .min(4, "Your meal name should be at lease four alphabets.")
         .max(50, "Your meal name must not be longer than fifty alphabets.")
  })

export const recipeSchema = z.object({
  summmary: z.string()
             .min(10)
             .max(200),
  steps: z.array(z.string())
          .length(5)
})

export const validemailInput = z.object({
  fullname: z.string()
             .trim()
             .min(4, "Name must be at least 4 characters")
             .max(50, "Name must not exceed 50 characters"),
  email: z.string()
          .trim()
          .pipe(z.email("Invalid email address")),
  phonenumber:z.string()
               .trim()
               .min(7, "Phone number too short")
               .max(20, "Phone number too long"),
  subject: z.string()
            .min(4, "Subject must be at least 4 characters")
            .max(50, "Subject must not exceed 50 characters"),
  message: z.string()
            .min(10, "Message must be at 10 characters")
            .max(500, "Message must exceed 500 characters")
})