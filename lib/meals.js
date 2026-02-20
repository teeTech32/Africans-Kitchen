"use server"

import prisma from "@/lib/prisma"
// import slugify from 'slugify'
// import xss from 'xss'
import { DeleteObjectCommand, S3, PutObjectCommand } from '@aws-sdk/client-s3'
import { revalidatePage } from './revalidatepage'
import { notFound } from "next/navigation"
import { getAuthUser } from "./auth"


const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials:{
    accessKeyId : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
  },
})

// Fetch all meals
export async function getMeals(){
  if(process.env.NODE_ENV !== 'production'){
    await new Promise((resolve)=>setTimeout(resolve, 3000))
  }
  const meals = await prisma.meal.findMany()
  return meals
}

// Fetch single meal slug
export async function getMeal(mealSlug){
  if(!mealSlug){
    return null;
  }
  const meal = await prisma.meal.findFirst({
    where: {slug: mealSlug},
  });
  if(!meal){
    notFound()
  }
  return meal
}

// Delete a meal
export async function deleteMeal(id){
  const meal = await prisma.meal.findUnique({ where: {id: id} });
  if(process.env.NODE_ENV !== 'production'){
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  try{
    const imageKey = meal.image 
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: imageKey
      })
    );
  }catch(error){
    return {
      success: false,
      error: 'DELETE_MEAL_FAILED',
      message: error.message || 'Something went wrong while deleting the meal!.'
    }
  }
    await prisma.meal.deleteMany({ where: { id: meal.id} })
    await revalidatePage();
    return {success: true}
  }
   
// Edit a meal
export async function editMeal(formData){
  const id = Number(formData.get('id'));
  const userName = formData.get('userName');
  const userEmail = formData.get('userEmail');
  const title = formData.get('title');
  const summary = formData.get('summary');
  const instructions = formData.get('instructions');
  const image = formData.get('image');

  const meal = await prisma.meal.findUnique({ where: {id} });
  if(process.env.NODE_ENV !== 'production'){
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if(!meal){
    throw new Error("The Chosen Meal dosen't exist!")
  }
  let finalImage = meal.image;
  // Upload new Image to s3 if exist.
  if(image && typeof image !== 'string' && image.size > 0){
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const newKey = `${Date.now()}-${image.name}`
    try{
      await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Body: imageBuffer,
        Key: newKey,
        ContentType: image.type,
      })
    )
    // Delete old image if present
    if( meal.image){
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: meal.image
        })
      )
    }
    finalImage = newKey;
    }catch(error){
      return{
        success: false,
        error: 'UPDATED MEAL FAILED',
        message: error.message || 'Something went wrong, check your internet connections'
      }
    }
  }
  await prisma.meal.update({
    where: {id},
    data: {
      userName,
      userEmail,
      title,
      summary,
      instructions,
      image: finalImage
    }
  });
  return {success: true}
}
