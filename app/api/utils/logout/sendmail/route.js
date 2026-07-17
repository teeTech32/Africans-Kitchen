import { NextResponse } from "next/server";
import nodemailer from "nodemailer"
import { validemailInput } from "@/lib/inputValidationWithZod"; ''

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth:{
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function POST(req){
  const body = await req.json();

  const parsed = validemailInput.safeParse(body);

  const firstError = parsed.error?.issues[0].message || "Invalid Inputs"

  if(!parsed.success){
    return NextResponse.json({error: firstError}, {status : 400});
  }
  const { fullname, email, phonenumber, subject, message } = parsed.data
  try{
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject,
      html: `
      <div style="background-color:#f8f9fa; color:#212529; padding:16px; border:1px solid #dee2e6; border-radius:8px;">
        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phonenumber}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    `,
    })
    return NextResponse.json({message: "Your message has been sent successfully"}, {status: 200})
  }catch(error){
    return NextResponse.json({error: "If your email is valid, check your network"}, {status: 500})
  }  
}