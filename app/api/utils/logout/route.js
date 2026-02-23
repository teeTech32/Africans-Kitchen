import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashRefreshToken } from '../tokens/route'

export async function POST() {
  const cookieStored = cookies()
  const refreshToken = cookieStored.get('refreshToken')?.value;
  if(refreshToken){
    await prisma.session.deleteMany({
      where: {hashedRefreshToken: hashRefreshToken(refreshToken)}
    })
    cookieStored.set({
      name: "accessToken",
      value: "",
      httpOnly: true,
      path:'/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0)
    })
    cookieStored.set({
      name: "refreshToken",
      value: "",
      httpOnly: true,
      path:'/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0)
    })
    return NextResponse.json({message:'User logged out'}, {status:200});
  }
}
