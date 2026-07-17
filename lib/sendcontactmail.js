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

export async function sendContactEmail({ fullname, email, phonenumber, subject, message }){
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
}