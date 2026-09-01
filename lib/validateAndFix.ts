import { recipeSchema } from '@/lib/inputValidationWithZod'
import { string, z } from 'zod'
type AIRecipeData = {
  summary: unknown;
  steps: unknown;
}
type RecipeData = z.infer<typeof recipeSchema>;

export function validateAndFix(data:AIRecipeData): RecipeData {

  let summary = typeof data.summary === "string" ? data.summary :  '' ;
  let steps = Array.isArray(data.steps) ? data.steps.filter((step): step is string => typeof step === "string") : [];

  // Keep roughly 20 words
  summary = summary.trim().split(/\s+/).slice(0, 20).join(" ");

  // Force exactly five steps
  steps = steps.slice(0, 5);

  while(steps.length < 5){
    steps.push("Steps not provided.")
  }

  return recipeSchema.parse({
    summary,
    steps,
  })
}