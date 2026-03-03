export const runtime = "nodejs";

import xss from "xss";
import slugify from "slugify";
import prisma from "@/lib/prisma";
import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "../../utils/tokens/route";

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials:{
    accessKeyId : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export async function POST(req){
    const formData = await req.formData()

    const userName = formData.get("userName")
    const userEmail = formData.get("userEmail")
    const title = formData.get("title")
    const summary = formData.get("summary")
    const instructions = formData.get("instructions")
    const image = formData.get("image")

    const authUser = req.headers.get("Authorization")
    if(!authUser){
      return NextResponse.json({error: "Unauthorized User"}, {status: 401})
    }
    
    const accessToken = authUser.split(' ')[1]
    const decoded = verifyAccessToken(accessToken) 
    if(!decoded){
        return NextResponse.json({error: "Unauthorized User"}, {status: 401})
    } 
    
    const slug = slugify(title, {lower:true})
    const mealExist = await prisma.meal.findFirst({
      where: {
        slug,
        userId: decoded.payload.id
      }
    })

    if(mealExist){
      return NextResponse.json({error: "You have already created a meal with the same title before"}, {status: 409})
    }

    const extension = image.name.split('.').pop();
    const fileName = `${slug}.${extension}`

    try{
      await s3.send( new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: fileName,
          Body: Buffer.from(await image.arrayBuffer()),
          ContentType: image.type
        }))
    }catch(error){
      return NextResponse.json({error: "Something went wrong, check your internet connections."}, {status: 500})
    }
      
    const  securedInstructions = xss(instructions)

    await prisma.meal.create({
      data:{
        userName: userName,
        userEmail: userEmail,
        title: title,
        slug: slug,
        summary: summary,
        instructions: securedInstructions,
        image: fileName,
        userId: decoded.payload.id
      }
    })
    return NextResponse.json({status: 200})
}