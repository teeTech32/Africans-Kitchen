import {cookies} from "next/headers"
import { hashRefreshToken, signAccessToken, verifyRefreshToken, signRefreshToken} from "@/lib/tokens"
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST() {
  const cookieStored = await cookies()
  const refreshToken = cookieStored.get('refreshToken')?.value;
  const decoded =  verifyRefreshToken(refreshToken);
  if(!refreshToken){
    return NextResponse.json({error:"Unauthorized User"}, {status:401})
  }
  if(!decoded){
    return NextResponse.json({error:"Unauthorized User"}, {status:401})
  }
  const hashToken = hashRefreshToken(refreshToken)
  const session = await prisma.session.findFirst({
    where:{hashedRefreshToken: hashToken },
    include: {user: true}
  })
  if(!session){
    return NextResponse.json({error:"Unauthorized User"}, {status:401})
  }
  if(session.expiresAt < new Date()){
    await prisma.session.deleteMany({
      where: {id: session.id}
    })
    return NextResponse.json({error:"Unauthorized User"}, {status: 404})
  }
// ROTATE ACCESSTOKEN
 const accessToken = signAccessToken({id: session.user.id, email: session.user.email})
  cookieStored.set({
    name: 'accessToken',
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:'/',
    maxAge: 60 * 15 
  })
  // ROTATE REFRESHTOKEN
 const tokenRefreshed = signRefreshToken({id: session.user.id, email: session.user.email})
  cookieStored.set({
    name: 'refreshToken',
    value: tokenRefreshed,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:'/',
    maxAge: 60 * 60 * 24 * 7  
  })
  // ROTATE SESSION IN THE DATABASE
  const update = await prisma.session.updateMany({
    where: {
      id: session.id,
      hashedRefreshToken: hashToken
    },
    data: {
      hashedRefreshToken: hashRefreshToken(tokenRefreshed)
    }  
  })
  return NextResponse.json({success: true}, {status: 200}  )
}
