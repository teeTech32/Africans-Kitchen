import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from 'crypto'

export async function GET(req){
  const {searchParams} = new URL(req.url)
  const  token = searchParams.get('token')

  if(!token){
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/authusers/FailedVerification`))
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  const user = await prisma.user.findFirst({
    where:{hashedVerificationToken: hashedToken}
  })

  if(!user || user.verificationExpires < new Date()){
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/authusers/FailedVerification`));
  }
 
  await prisma.user.update({
    where:{id: user.id},
    data:{
      verified: true,
      hashedVerificationToken:  null,
      verificationExpires : null
    }
  }) 
  
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/authusers/LogIn?verified=true`)
}