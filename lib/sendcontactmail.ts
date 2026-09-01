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

type SendContactProps = {
  fullname: string;
  email: string;
  phonenumber: string;
  subject: string;
  message: string;
}

  function escapeHtml(value: string): string{
    return value.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
  }

export async function sendContactEmail({ fullname, email, phonenumber, subject, message }: SendContactProps): Promise<void>{
  const safeFullname = escapeHtml(fullname);
  const safeEmail = escapeHtml(email);
  const safePhonenumber = escapeHtml(phonenumber);
  const safeMessage = escapeHtml(message)
 
  await transporter.sendMail({
    from: smtpenv.SMTP_USER,
    to: smtpenv.SMTP_USER,
    replyTo: email,
    subject,
    html: `
    <div style="background-color:#f8f9fa; color:#212529; padding:16px; border:1px solid #dee2e6; border-radius:8px;">
      <p><strong>Name:</strong> ${safeFullname}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone Number:</strong> ${safePhonenumber}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    </div>
  `,
  })
}