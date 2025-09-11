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

export async function sendResetEmail(email, token, user){
  const name = user.name.split(' ')[1]
  console.log(name)
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/authusers/ForgetPasswordPage?token=${token}`
  await transporter.sendMail({
    from: '"African Kitchens"<no-reply@Africansfoods>',
    to: email,
    subject: 'Password Reset Request',
    html:`<h3>Hi ${name},</h3>
    <p>We received a request to reset your password with the following provided email: ${email}.</p>
    <a href="${resetUrl}">Click this link to reset your password</a>
    <p>If you didn't request this, you can safely ignore this message, your account is still secure.</p>
    <h4>Stay safe.</h4>`
  })
}
