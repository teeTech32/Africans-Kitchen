import { cookies } from "next/headers" 
import { verifyAccessToken } from "@/lib/tokens";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(){
  const cookieStored = await cookies();
  const accessToken = cookieStored.get('accessToken')?.value;
   if(!accessToken){
    return NextResponse.json({error:"Unauthorized User"}, {status:401})
  }
  const decoded = verifyAccessToken(accessToken);
  if(!decoded){
    return NextResponse.json({error:"Unauthorized User"}, {status:401})
  }
  const user = await prisma.user.findUnique({
    where: {id: decoded.payload.id}
  })
  if(!user){
    return NextResponse.json({error:"Unauthorized User"}, {status:401})
  }
  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email}, {status: 200})
}
