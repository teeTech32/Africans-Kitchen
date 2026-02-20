"use server"

import MealReturnValue from "@/components/Meals/MealReturnValue"
import { getAuthUser } from "@/lib/auth"
import { getMeal } from "@/lib/meals"
import { redirect } from "next/navigation"


const AWS_REGION = process.env.AWS_REGION
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET

export default async function MealDetailsPage({ params }) {

  if (!AWS_REGION || !AWS_S3_BUCKET) {
  throw new Error("Missing AWS environment variables")
}

  // --- Step 4: Fetch authenticate user and fetch meal ---
  const {mealSlug}  = await params
  const user = await getAuthUser()
  const meal = await getMeal(mealSlug)

  // --- Step 5: Build image URL ---
  const imageUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${meal.image}`
  const instructions = meal.instructions?.replace(/\n/g, "<br/>") || ""

  return (
    <MealReturnValue
      meal={meal}
      imageUrl={imageUrl}
      mealInstructions={instructions}
      userId={user.id}
    />
  )
}

// --- Step 8: Generate metadata for SEO ---
export async function generateMetadata({ params }) {
  const { mealSlug } = await params
  const meal = await getMeal(mealSlug)

  if (!meal) {
    return { title: "Meal not found", description: "This meal does not exist." }
  }

  return {
    title: meal.title,
    description: meal.summary,
  }
}
