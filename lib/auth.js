"use server"

import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import { hashRefreshToken, verifyRefreshToken} from "@/lib/tokens"
import { redirect } from "next/navigation"

export async function getAuthUser() {
  const cookieStored = await cookies()
  const refreshToken = cookieStored.get('refreshToken')?.value;
  if(!refreshToken){
    return redirect('/authusers/LogIn')
  }
  const decoded =  verifyRefreshToken(refreshToken);
  if(!decoded){
    return redirect('/authusers/LogIn')
  }
  const hashedToken = hashRefreshToken(refreshToken)
  const session = await prisma.session.findFirst({
   where: {hashedRefreshToken: hashedToken,
           expiresAt: {gt: new Date()}
   }
  })
  if(!session){
    return redirect('/authusers/LogIn')
  }
  if(session.expiresAt < new Date()){
    await prisma.session.deleteMany({
      where: {id: session.id}
    })
    return redirect('/authusers/LogIn')
  }
  const user = await prisma.user.findUnique({
    where: {id: session?.userId}
  })
  if(!user){
    return redirect('/authusers/LogIn')
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }   
}