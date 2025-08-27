import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { token, password } = await req.json()
    const now = new Date()

    // Find the token if it's still valid
    const recordToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        expires_at: { gt: now }
      }
    })

    if (!recordToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user's password
    await prisma.user.update({
      where: { id: recordToken.userId },
      data: { password: hashedPassword }
    })

    // Delete the used token
    await prisma.passwordResetToken.delete({
      where: { id: recordToken.id } 
    })

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}