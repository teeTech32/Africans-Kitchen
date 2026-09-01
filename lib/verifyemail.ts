import nodemailer from "nodemailer"
import {smtpenv} from "./inputValidationWithZod"

const transporter = nodemailer.createTransport({
  host: smtpenv.SMTP_HOST,
  port: smtpenv.SMTP_PORT,
  secure: smtpenv.SMTP_PORT === 465,
  auth:{
    user: smtpenv.SMTP_USER,
    pass: smtpenv.SMTP_PASS
  }
})

type VerifyEmailProps = {
  email: string;
  name: string;
  verificationToken: string
}

function escapeHtml(value: string): string{
  return value.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;")
} 

export async function verifyEmail({email, verificationToken, name}: VerifyEmailProps):Promise<void>{
  const firstName = escapeHtml(name.split(' ')[0] || "There")
  const safeEmail = escapeHtml(email)
  const verifyUrl = new URL('/api/auth/verifyuser', smtpenv.NEXT_PUBLIC_BASE_URL) 
        verifyUrl.searchParams.set('token', verificationToken)

  await transporter.sendMail({
    from: process.env.SMTP_FORM,
    to: email,
    subject: 'Email Verification',
    html:`<div style="
            max-width: 600px;
            margin: 40px auto;
            padding: 30px;
            background-color: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
          ">
            <h3>Hi ${firstName},</h3>
            <p>
              We received a request to sign you up with the following provided email: ${safeEmail}.
            </p>
            <p>
              Please click the button below to verify your email address.
            </p>
            <a
              href="${verifyUrl.toString()}"
              style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #f59e0b;
                color: #000;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
              "
            >
              Continue Your Resgistion
            </a>
            <p>
              If you didn't request this, you can safely ignore this message.
              Your email account is still secure.
            </p>
            <h4>Stay safe.</h4>
          </div>`.trim(),
  })
}
