import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { NextResponse } from "next/server"
import { sendResetEmail } from "@/lib/email"

const prisma = new PrismaClient()

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
    const expires_at = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires_at
      }
    })

    await sendResetEmail(email, token)

    return NextResponse.json(
      { message: "Email sent, check your inbox to proceed" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create reset token, check your connection", details: error.message },
      { status: 500 }
    )
  }
}