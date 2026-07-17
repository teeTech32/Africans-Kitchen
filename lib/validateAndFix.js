import { recipeSchema } from '@/lib/inputValidationWithZod'

export function validateAndFix(data){

  let summary = data.summary || ''
  let steps = Array.isArray(data.steps) ? data.steps : [];

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