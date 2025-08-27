"use server"

import MealReturnValue from "@/components/Meals/MealReturnValue"
import { getMeal } from "@/lib/meals"
import { getUser } from "@/lib/auth"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"


const AWS_REGION = process.env.AWS_REGION
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET

export default async function MealDetailsPage({params}){
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value;
  
  if(!token){
    return redirect('/authusers/SignUp')
  }
  const {mealSlug} = await params;
  const meal = await getMeal(mealSlug);
  
  
  if(!meal){
    notFound()
  }
  const imageUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${meal.image}`
  meal.instructions =  meal.instructions.replace(/\n/g, '<br/>')
  // Decoding the token to fetch and authorize the presence user access to delete and edit meals that was only created by him or her.
  const database64payload = token.split('.')[1]
  const decoded = JSON.parse(Buffer.from(database64payload, "base64").toString())
  const user = await getUser(decoded.email);
  const data = await user.json();
  const userEmail = data.user.email;
  
  return<MealReturnValue meal={meal} imageUrl={imageUrl} mealInstructions={meal.instructions} email={userEmail} />
}

export async function generateMetadata({params}){
  const {mealSlug} = await params;
  const meal = await getMeal(mealSlug);
  return{
    title:meal.title,
    description:meal.summary,
  }
}