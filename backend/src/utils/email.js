import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from:    `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
  })
  return info
}

/* ── Email templates ── */
export const sendWelcomeEmail = (user) =>
  sendEmail({
    to:      user.email,
    subject: 'Welcome to MediCart!',
    html:    `<h2>Hi ${user.name},</h2><p>Welcome to MediCart — Your Health, Delivered.</p>`,
  })

export const sendOtpEmail = (email, otp) =>
  sendEmail({
    to:      email,
    subject: 'MediCart — Your OTP Code',
    html:    `<h2>Your OTP</h2><p>Your OTP is: <strong style="font-size:24px;letter-spacing:4px">${otp}</strong></p><p>Valid for 10 minutes.</p>`,
  })

export const sendPasswordResetEmail = (email, resetUrl) =>
  sendEmail({
    to:      email,
    subject: 'MediCart — Password Reset Request',
    html:    `<h2>Reset Password</h2><p>Click below to reset your password:</p><a href="${resetUrl}" style="background:#14b574;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Reset Password</a><p>Valid for 15 minutes.</p>`,
  })

export const sendOrderConfirmationEmail = (user, order) =>
  sendEmail({
    to:      user.email,
    subject: `MediCart — Order Confirmed #${order.orderId}`,
    html:    `<h2>Order Placed Successfully!</h2><p>Hi ${user.name}, your order <strong>#${order.orderId}</strong> has been placed.</p><p>Total: ₹${order.totalPrice}</p><p>Estimated delivery: ${new Date(order.estimatedDelivery).toDateString()}</p>`,
  })

export default sendEmail