"use server"
import xss from "xss";
import slugify from "slugify";
import prisma from "@/lib/prisma"
import  { DeleteObjectCommand, S3, PutObjectCommand } from '@aws-sdk/client-s3'
import { revalidatePage } from './revalidatepage'
import { notFound } from "next/navigation"
import { awsenv, valideditemailInput } from "@/lib/inputValidationWithZod"
import { MealDataResponse, Meal } from "@/types/meal";


const s3 = new S3({
  region: awsenv.AWS_REGION,
  credentials:{
    accessKeyId : awsenv.AWS_ACCESS_KEY_ID,
    secretAccessKey : awsenv.AWS_SECRET_ACCESS_KEY,
  },
})

// Create Meal
type createMealProps = {
  title: string;
  summary: string;
  instructions: string;
  image: File;
  userName: string;
  userEmail: string;
  userId: number;
}
type CreateMealResponse = {
  success: boolean;
  message?: string;
  status?: number;
  error?: string;
}
export async function createMeal(meal: createMealProps): Promise<CreateMealResponse>{

    const slug = slugify(meal.title, {lower:true})
    const mealExist = await prisma.meal.findFirst({
      where: {
        slug,
        userId: meal.userId
      }
    })

    if(mealExist){
      return{
        success: false,
        message: "You have already created a meal with the same title before", status: 409
      }
    }

    const extension = meal.image.name.split('.').pop();
    const fileName = `${slug}.${extension}`

    try{
      await s3.send( new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: fileName,
          Body: Buffer.from(await meal.image.arrayBuffer()),
          ContentType: meal.image.type
        }))
    }catch(error){
      const message = error instanceof Error ? error.message : "Something went wrong, check your internet connections"
      return{
        success: false,
        error: 'CREATING MEAL FAILED',
        message
      } 
    }
      
    const  securedInstructions = xss(meal.instructions)

    await prisma.meal.create({
      data:{
        userName: meal.userName,
        userEmail: meal.userEmail,
        title: meal.title,
        slug: slug,
        summary: meal.summary,
        instructions: securedInstructions,
        image: fileName,
        userId: meal.userId
      }
    })
    return {success: true}
}

export async function getMeals(page:number = 1, limit:number = 5): Promise<MealDataResponse>{
  
  if(process.env.NODE_ENV !== 'production'){
    await new Promise((resolve)=>setTimeout(resolve, 3000))
  }
  const [meals, total] = await Promise.all([
    prisma.meal.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy:{
      createdAt: "desc"
      }
    }),
    prisma.meal.count()
  ])
  const totalPages = Math.ceil(total / limit)
  const result = {
    data: meals || [],
    meta:{
      page,
      limit,
      total,
      totalPages 
    }
  }
  return result
}

// Fetch single meal slug

export async function getMeal(mealSlug: string): Promise<Meal | null>{
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

type DeleteMealResponse = {
  success: boolean;
  message?: string;
  error?: string;
}
export async function deleteMeal(id: number): Promise<DeleteMealResponse>{
  const meal = await prisma.meal.findUnique({ where: {id: id} });
  if(process.env.NODE_ENV !== 'production'){
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if (!meal) {
    return {
      success: false,
      error: "MEAL_NOT_FOUND",
      message: "Meal not found",
    };
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
    const message = error instanceof Error ? error.message : "Something went wrong while deleting the meal!."
    return {
      success: false,
      error: 'DELETE_MEAL_FAILED',
      message
    }
  }
    await prisma.meal.deleteMany({ where: { id: meal.id} })
    await revalidatePage();
    return {success: true}
  }
   
// Edit a meal
type EditMealResponse = {
  success: boolean;
  message?: string | undefined;
  error?: string | undefined;
}
export async function editMeal(formData: FormData): Promise<EditMealResponse>{
  const pursedEditValue = valideditemailInput.safeParse({
    id : Number(formData.get('id') ?? ""),
    userName : String(formData.get('userName') ?? ""),
    userEmail : String(formData.get('userEmail') ?? ""),
    title : String(formData.get('title') ?? ""),
    summary : String(formData.get('summary') ?? ""),
    instructions : String(formData.get('instructions') ?? "")
   }) 
  if(!pursedEditValue.success){
  const message =  pursedEditValue.error.issues[0]?.message ?? "Check your inputs"
  return {
    success: false,
    message
    }
  } 
  const {id, userName, userEmail, title, summary, instructions}  = pursedEditValue.data
  const image = formData.get("image");
  const meal = await prisma.meal.findUnique({ where: {id} });
  if(process.env.NODE_ENV !== 'production'){
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if(!meal){
    return {
      success: false,
      message: "Meal not found"
    }
  }
  let finalImage = meal.image;
  // Upload new Image to s3 if exist.
  if(image instanceof  File && image.size > 0){
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
      const message = error instanceof Error ? error.message : "Something went wrong, check your internet connections"
      return{
        success: false,
        error: 'UPDATED MEAL FAILED',
        message
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
