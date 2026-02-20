import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma"
import crypto from "crypto"
import {verifyEmail} from "@/lib/verifyemail";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await verifyEmail(email, verificationToken, name);

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex')
    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        hashedVerificationToken : hashedVerificationToken,
        verificationExpires : new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
    
    return NextResponse.json({ message:"Email sent, check your email to Login" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Check your internet connection' }, { status: 500 });
  }
}