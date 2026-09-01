import { z } from 'zod'

//Check if meal name for AI input is valid
export const generateRecipeSchem = z.object({
  meal: z.string()
         .trim()
         .min(4, "Your meal name should be at lease four alphabets.")
         .max(50, "Your meal name must not be longer than fifty alphabets.")
  })
//Check if recipe input is valid
export const recipeSchema = z.object({
  summmary: z.string()
             .min(10)
             .max(200),
  steps: z.array(z.string())
          .length(5)
})
//Check if email input is valid
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
// Zod schema for SMTP environment variables
export const smtpenv = z.object({
                        SMTP_HOST: z.string().min(1),
                        SMTP_PORT: z.coerce.number().int().positive(),
                        SMTP_USER: z.string().pipe(z.email()),
                        SMTP_PASS: z.string().min(1),
                        NEXT_PUBLIC_BASE_URL: z.string().pipe(z.url()) 
                      })
                      .parse({
                        SMTP_HOST: process.env.SMTP_HOST,
                        SMTP_PORT: process.env.SMTP_PORT,
                        SMTP_USER: process.env.SMTP_USER,
                        SMTP_PASS: process.env.SMTP_PASS,
                        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
                      })
//Check if email exist
export const checkemail = z.object({
  email: z.string()
          .trim()
          .pipe(z.email("Please enter a valid email address"))
})
//Check if login input is valid
export const logininput = z.object({
  email: z.string()
          .trim()
          .pipe(z.email("Enter a valid email address")),
  password: z.string()
             .trim()
             .min(2, "Your password should be 2 character max")
})
//Check if AWS secret keys are valid
const awsschema = z.object({
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1)
})
export const awsenv = awsschema.parse({
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION
})
//Check Edit meal inputs
export const valideditemailInput = z.object({
  id: z.number().min(7, "Contact too short"),
  userName: z.string()
             .trim()
             .min(4, "Name must be at least 4 characters")
             .max(50, "Name must not exceed 50 characters"),
  userEmail: z.string()
          .trim()
          .pipe(z.email("Invalid email address")),
  title:z.string()
               .trim()
               .min(1, "title name too short")
               .max(20, "title name too long"),
  summary: z.string()
            .min(4, "Summary must be at least 4 characters")
            .max(200, "Summary must not exceed 50 characters"),
  instructions: z.string()
            .min(10, "Instructions must be at 10 characters")
            .max(500, "Instructions must exceed 500 characters"),
})