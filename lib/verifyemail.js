import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth:{
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function verifyEmail(email, verificationToken, name){
  const firstName = name.split(' ')[0] || "There"
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verifyuser?token=${verificationToken}`

  await transporter.sendMail({
    from: '"African Kitchens"<no-reply@Africansfoods>',
    to: email,
    subject: 'Email Verification',
    html:`<h3>Hi ${firstName},</h3>
    <p>We received a request to sign you up with the following provided email: ${email}.</p>
    <a  style="display:inline-block;padding:10px 20px;background-color:#f59e0b;color:#000; border-radius:8px;text-decoration:none;font-weight:bold;" href="${verifyUrl}">Click this link to continue your registration</a>
    <p>If you didn't request this, you can safely ignore this message, your email account is still secure.</p>
    <h4>Stay safe.</h4>`
  })
}
