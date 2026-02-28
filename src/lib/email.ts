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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface BookingMailDetails {
  name: string;
  email: string;
  serviceTitle: string;
  dateLabel: string;
  time: string;
  notes?: string;
  meetingLink: string;
}

export async function sendBookingScheduledEmailToUser(details: BookingMailDetails): Promise<void> {
  const mailOptions = {
    from: `"Disconnect Agencies" <${process.env.EMAIL_FROM}>`,
    to: details.email,
    subject: 'Your Call Is Scheduled – Disconnect Agencies',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 32px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px 34px;">
          <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700;">Meeting Scheduled</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Disconnect Agencies</p>
        </div>
        <div style="padding: 30px 34px;">
          <p style="margin: 0 0 16px; color: #374151;">Hi ${escapeHtml(details.name)}, your call has been confirmed.</p>
          <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb; margin-bottom: 16px;">
            <p style="margin: 0 0 8px; color: #111827;"><strong>Service:</strong> ${escapeHtml(details.serviceTitle)}</p>
            <p style="margin: 0 0 8px; color: #111827;"><strong>Date:</strong> ${escapeHtml(details.dateLabel)}</p>
            <p style="margin: 0 0 8px; color: #111827;"><strong>Time:</strong> ${escapeHtml(details.time)}</p>
            ${details.notes ? `<p style="margin: 0; color: #111827;"><strong>Notes:</strong> ${escapeHtml(details.notes)}</p>` : ''}
          </div>
          <a href="${escapeHtml(details.meetingLink)}" style="display:inline-block; background:#111827; color:#fff; text-decoration:none; font-weight:600; border-radius:10px; padding:12px 18px;">
            Join Meeting
          </a>
          <p style="margin: 16px 0 0; color: #6b7280; font-size: 13px;">If the button does not work, use this link:<br>${escapeHtml(details.meetingLink)}</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendBookingScheduledEmailToAdmins(
  recipients: string[],
  details: BookingMailDetails
): Promise<void> {
  if (!recipients.length) return;

  const mailOptions = {
    from: `"Disconnect Agencies" <${process.env.EMAIL_FROM}>`,
    to: recipients.join(','),
    subject: `New Booking Scheduled – ${details.serviceTitle}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 32px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px 34px;">
          <h1 style="color: #fff; margin: 0; font-size: 22px; font-weight: 700;">New Booking Scheduled</h1>
        </div>
        <div style="padding: 30px 34px; color: #111827;">
          <p style="margin: 0 0 10px;"><strong>Name:</strong> ${escapeHtml(details.name)}</p>
          <p style="margin: 0 0 10px;"><strong>Email:</strong> ${escapeHtml(details.email)}</p>
          <p style="margin: 0 0 10px;"><strong>Service:</strong> ${escapeHtml(details.serviceTitle)}</p>
          <p style="margin: 0 0 10px;"><strong>Date:</strong> ${escapeHtml(details.dateLabel)}</p>
          <p style="margin: 0 0 10px;"><strong>Time:</strong> ${escapeHtml(details.time)}</p>
          ${details.notes ? `<p style="margin: 0 0 10px;"><strong>Notes:</strong> ${escapeHtml(details.notes)}</p>` : ''}
          <p style="margin: 0;"><strong>Meeting Link:</strong> ${escapeHtml(details.meetingLink)}</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
