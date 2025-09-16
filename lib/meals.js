"use server"

import prisma from "@/lib/prisma"
import slugify from 'slugify'
import xss from 'xss'
import { DeleteObjectCommand, S3, PutObjectCommand } from '@aws-sdk/client-s3'
import { revalidatePage } from './revalidatepage'

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials:{
    accessKeyId : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
  },
})

// Fetch all meals
export async function getMeals(){
  //I could as well remove the promising function so that I can fetch from the database faster, but I wanted to show the possibilities in Next.js and how elegant I could handle loading data or resource dely in the client-side (the browser) 
  if(process.env.NODE_ENV !== 'production'){
    await new Promise((resolve)=>setTimeout(resolve, 3000))
  }
  const meals = await prisma.meal.findMany()
  return meals
}

// Fetch single meal slug
export async function getMeal(slug){
   const meal = await prisma.meal.findFirst({
    where: {slug}
   });
   return meal
}

// Create a meal
export async function createMeal(meal){
  try{
    //I use slugify here for generating slug and turning it into lowercase value for each meal formData so that it could tally with keys I have in the database table.
  const slug = slugify(meal.title, {lower:true});
  //If you observed vividly, you will discover that I used a method called dangerouslySetInnerHTML() to render the insructions value on the client-side so that I could use Regular Expression on it for always proper arrangement of instructions input from users which made the application vulnerable to cross-site scripting attackers. In other to prevent this, I employed xss.
  meal.instructions = xss(meal.instructions);
  // I needed to create a special fileName for each image that comes in and store in file system ('/public/images/fileName')
  const extension = meal.image.name.split('.').pop();
  const fileName = `${slug}.${extension}`
  const bufferedImage = await meal.image.arrayBuffer();
  // in other to write and work with AWS s3 Bucket, I used (PutObjectCommand, from AWS s3)
  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type
  }));
  // I needed to declear the name of image save in the database for each image that comes in from users.
  meal.image = `${fileName}`
  //I checked if the slug name already exist in the table against clashing of image name while viewing meal.
  const slugExist = await prisma.meal.findFirst({ where: {slug }})
  // now I could save data into the database
  if(!slugExist){
   await prisma.meal.create({
    data: {
      title: meal.title,
      creator: meal.creator,
      creator_email: meal.creator_email,
      summary: meal.summary,
      instructions: meal.instructions,
      image: meal.image,
      slug: slug
    }
   })
  } 
  return {success: true}

  }catch(error){
    return {
      success: false,
      error: 'CREATE_MEAL_FAILED',
      message: error.message || 'Something went wrong while creating the meal.',
    };
  }
}

// Delete a meal
export async function deleteMeal(id){
  try{
    const meal = await prisma.meal.findUnique({ where: {id: Number(id) } });
  //I could as well remove the promising function so that I can delete from the database faster, but I wanted to show the possibilities in Next.js and how elegant I could handle deleting data or resource dely in the client-side (the browser) 
  if(process.env.NODE_ENV !== 'production'){
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if(meal){
    const imageKey = meal.image 
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: imageKey
      })
    );
    await prisma.meal.delete({ where: { id: meal.id} })
    await revalidatePage();
    return {success: true}
  }else {
    return {
      success: false,
      error: 'MEAL_NOT_FOUND',
      message: 'The meal does not exist.'
    };
  }
  }catch(error){
    return {
      success: false,
      error: 'DELETE_MEAL_FAILED',
      message: error.message || 'Something went wrong while deleting the meal!.'
    }
  } 
}

// Edit a meal
export async function editMeal(formData){
  try{
    const id = Number(formData.get('id'));
    const creator = formData.get('creator');
    const creator_email = formData.get('creator_email');
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
    }

    await prisma.meal.update({
      where: {id},
      data: {
        creator,
        creator_email,
        title,
        summary,
        instructions,
        image: finalImage
      }
    });

    return {success: true}
  }catch(error){
    return{
      success: false,
      error: 'UPDATED MEAL FAILED',
      message: error.message || 'Something went wrong, check your internet connections'
    }
  }
}
