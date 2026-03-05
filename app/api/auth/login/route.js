import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { signAccessToken, hashRefreshToken, signRefreshToken } from "@/lib/tokens"

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req) {
  const { email, password } = await req.json()

  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  const normalizedEmail = email.trim().toLowerCase()

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  if (!user) {
    return NextResponse.json({ error: "User doesn't exist" }, { status: 404 })
  }

  if(user.verified !== true){
    return NextResponse.json({error: "You have to login through your email for email verification!"})
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return NextResponse.json({ error: "Invalid Credentials check your inputs" }, { status: 400 })
  }

  const accessToken = signAccessToken({ id: user.id, email: user.email })
  const refreshToken = signRefreshToken({id: user.id, email: user.email })
  const hashedRefreshToken = hashRefreshToken(refreshToken)
  const refreshTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 7 * 1000) // 7days from now (milliseconds)

  await prisma.session.create({
    data:{
      hashedRefreshToken: hashedRefreshToken,
      expiresAt : refreshTokenExpiresAt,
      user: {
        connect : {
          id: user.id
        }
      }
    }
  })

  const information = `Welcome ${user.name}`

  return NextResponse.json({accessToken, refreshToken, information}, { status: 200 },)
}