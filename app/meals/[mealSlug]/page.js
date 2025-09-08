"use server"

import MealReturnValue from "@/components/Meals/MealReturnValue"
import { getMeal } from "@/lib/meals"
import { getUser } from "@/lib/auth"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

const AWS_REGION = process.env.AWS_REGION
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET

export default async function MealDetailsPage({ params }) {
  // --- Step 1: Get token from cookies ---
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  // If no token, force login/signup
  if (!token) {
    return redirect("/authusers/SignUp")
  }

  // --- Step 2: Decode token safely ---
  let decoded
  try {
    const parts = token.split(".")
    if (parts.length < 2) throw new Error("Invalid token format")

    decoded = JSON.parse(Buffer.from(parts[1], "base64").toString())
  } catch (error) {
    return redirect("/authusers/SignUp")
  }

  // --- Step 3: Validate decoded payload ---
  if (!decoded?.email) {
    return redirect("/authusers/SignUp")
  }

  // --- Step 4: Fetch meal ---
  const { mealSlug } = params
  const meal = await getMeal(mealSlug)

  if (!meal) {
    return notFound()
  }

  // --- Step 5: Build image URL ---
  const imageUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${meal.image}`
  meal.instructions = meal.instructions?.replace(/\n/g, "<br/>") || ""

  // --- Step 6: Fetch authenticated user ---
  let userEmail = null
  try {
    const userResponse = await getUser(decoded.email)
    if (!userResponse.ok) {
      return redirect("/authusers/SignUp")
    }

    const data = await userResponse.json()
    userEmail = data?.user?.email || data?.email || null

    if (!userEmail) {
      return redirect("/authusers/SignUp")
    }
  } catch (error) {
    return redirect("/authusers/SignUp")
  }

  // --- Step 7: Render component safely ---
  return (
    <MealReturnValue
      meal={meal}
      imageUrl={imageUrl}
      mealInstructions={meal.instructions}
      email={userEmail}
    />
  )
}

// --- Step 8: Generate metadata for SEO ---
export async function generateMetadata({ params }) {
  const { mealSlug } = params
  const meal = await getMeal(mealSlug)

  if (!meal) {
    return { title: "Meal not found", description: "This meal does not exist." }
  }

  return {
    title: meal.title,
    description: meal.summary,
  }
}
