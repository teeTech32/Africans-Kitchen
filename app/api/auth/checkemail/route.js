import prisma from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import { NextResponse } from "next/server"
import { sendResetEmail } from "@/lib/email"
import { hashRefreshToken } from "@/lib/tokens"


export async function POST(req) {
  try {
    const body = await req.json()
    const email = body.email?.toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "This user email does not exist" },
        { status: 400 }
      )
    }
    const token = uuidv4()
    const hashedToken = hashRefreshToken(token)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        expiresAt: expiresAt,
        user:{
          connect: {
            id: user.id
          }
        }
      }
    })
    
     await sendResetEmail(email, token, user)
    return NextResponse.json(
      { message: "Email sent, check your inbox to proceed" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create reset token, check your connection"},
      { status: 500 }
    )
  }
}
