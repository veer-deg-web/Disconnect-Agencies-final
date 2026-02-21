import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string, subject: string = 'Your OTP Code'): Promise<void> {
  const mailOptions = {
    from: `"Disconnect Agencies" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 32px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 36px 40px 28px;">
          <h1 style="color: #fff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Disconnect Agencies</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">Verification Code</p>
        </div>
        <div style="padding: 36px 40px;">
          <p style="color: #374151; font-size: 15px; margin: 0 0 24px;">Hello,</p>
          <p style="color: #374151; font-size: 15px; margin: 0 0 28px;">Use the OTP below to complete your verification. This code expires in <strong>10 minutes</strong>.</p>
          <div style="background: #f0fdf9; border: 2px solid #14b8a6; border-radius: 12px; text-align: center; padding: 24px 20px; margin-bottom: 28px;">
            <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #0d9488; font-family: 'Courier New', monospace;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 13px; margin: 0;">If you did not request this, please ignore this email or contact our support team.</p>
        </div>
        <div style="background: #f9fafb; padding: 20px 40px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">© 2024 Disconnect Agencies. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(to: string, otp: string): Promise<void> {
  await sendOtpEmail(to, otp, 'Reset Your Password – Disconnect Agencies');
}
