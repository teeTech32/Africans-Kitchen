"use server"

import MealReturnValue from "@/components/Meals/MealReturnValue"
import { getAuthUser } from "@/lib/auth"
import { getMeal } from "@/lib/meals"


const AWS_REGION = process.env.AWS_REGION
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET

type MealData = {
  params: string;
}

export default async function MealDetailsPage({ params }: MealData ){

  if (!AWS_REGION || !AWS_S3_BUCKET) {
    console.error("Missing AWS environment variables")
  }

  const {mealSlug}:any  = await params
  const user = await getAuthUser()
  const meal = await getMeal(mealSlug)

  const imageUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${meal?.image}`
  const instructions = meal?.instructions?.replace(/\n/g, "<br/>") || ""

  return (
    <MealReturnValue
      meal={meal}
      imageUrl={imageUrl}
      mealInstructions={instructions}
      currentUserId={user.id}
    />
  )
}

// Search Engine Optimization (SEO)
export async function generateMetadata({ params }: MealData) {
  const { mealSlug }: any = await params
  const meal = await getMeal(mealSlug)

  if (!meal) {
    return { title: "Meal not found", description: "This meal does not exist." }
  }

  return {
    title: `${meal.title} Recipe | Foodies `,
    description: meal.summary,
    alternates:{
      canonicla: `/meals/${meal.slug}`
    },
    openGraph:{
      title: meal.title,
      description: meal.summary,
      image: meal.image //We have this because only one image is saved each meal
    }
  }
}
