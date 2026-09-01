import nodemailer from "nodemailer"
import { smtpenv } from "./inputValidationWithZod"

const transporter = nodemailer.createTransport({
  host: smtpenv.SMTP_HOST,
  port: smtpenv.SMTP_PORT,
  secure: smtpenv.SMTP_PORT === 465,
  auth:{
    user: smtpenv.SMTP_USER,
    pass: smtpenv.SMTP_PASS
  }
})

type sendResetEmailProps = {
  email: string;
  token: string;
  name: string;  
}

function escapeHtml(value: string): string{
  return value.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;")
}

export async function sendResetEmail({email, token, name}: sendResetEmailProps): Promise<void>{

  const safeName = escapeHtml(name.split(' ')[0] || 'There')
  const safeEmail = escapeHtml(email)
  
   const resetUrl = new URL('/authusers/ForgetPasswordPage', smtpenv.NEXT_PUBLIC_BASE_URL)
         resetUrl.searchParams.set('token', token)
  await transporter.sendMail({
    from: `"African Kitchens"<${smtpenv.SMTP_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html:`
          <div style="
                      max-width: 600px;
                      margin: 40px auto;
                      padding: 30px;
                      background-color: #ffffff;
                      font-family: Arial, Helvetica, sans-serif;
                    ">
            <h3>Hi ${safeName},</h3>
            <p>We received a request to reset your password with the following provided email: ${safeEmail}.</p>
            <a style="display:inline-block;padding:10px 20px;background-color:#f59e0b;color:#000; border-radius:8px;text-decoration:none;font-weight:bold;" href="${resetUrl.toString()}">Click this link to reset your password</a>
            <p>If you didn't request this, you can safely ignore this message, your account is still secure.</p>
            <h4>Stay safe.</h4>
          </div>`.trim()
  })
}
