import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import BookingSettings from '@/models/BookingSettings';
import { CategoryType, serviceData } from '@/components/data/serviceData';
import {
  sendBookingScheduledEmailToAdmins,
  sendBookingScheduledEmailToUser,
} from '@/lib/email';
import { createGoogleMeetLink } from '@/lib/googleMeet';
import { sanitizeInput } from '@/lib/sanitizer';
import { safeParseJson } from '@/lib/utils';
import { bookingScheduleSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = bookingScheduleSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const body = sanitizeInput(parsed.data);
    const { name, email, category, time, notes } = body;

    await dbConnect();

    const selectedDate = new Date(body.date);
    const dateIso = selectedDate.toISOString();
    const dateLabel = selectedDate.toLocaleDateString('en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    const serviceTitle = serviceData[category as CategoryType].title;

    // 1. Attempt to create Google Meet link with a 10s timeout
    let meetingLink = '';
    try {
      const meetPromise = createGoogleMeetLink({
        title: `${serviceTitle} Consultation – ${name}`,
        dateIso,
        time,
        guestEmail: email,
      });

      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('Google Meet generation timed out')), 10000)
      );

      meetingLink = await Promise.race([meetPromise, timeoutPromise]);
    } catch (meetErr) {
      console.error('[bookings/schedule] Google Meet generation failed or timed out:', meetErr);
    }

    // Collect admin e-mails
    let settings = await BookingSettings.findOne();
    if (!settings) {
      settings = await BookingSettings.create({ adminEmails: [] });
    }

    const configuredAdminFallback = (process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '')
      .trim().toLowerCase();

    const adminEmails = Array.from(
      new Set(
        [...(settings.adminEmails || []), configuredAdminFallback]
          .map((e: string) => e.trim().toLowerCase())
          .filter((e: string) => isValidEmail(e))
      )
    );

    // 2. Persist booking
    const booking = await Booking.create({
      name, email, category, serviceTitle,
      dateIso, dateLabel, time, notes,
      meetingLink,
      adminEmailsNotified: adminEmails,
    });

    // 3. Attempt to send emails (background)
    const mailDetails = { name, email, serviceTitle, dateLabel, time, notes, meetingLink };
    Promise.all([
      sendBookingScheduledEmailToUser(mailDetails),
      adminEmails.length
        ? sendBookingScheduledEmailToAdmins(adminEmails, mailDetails)
        : Promise.resolve(),
    ]).catch(mailErr => {
      console.error('[bookings/schedule] Email delivery failed AFTER booking saved:', mailErr);
    });

    return NextResponse.json({
      message: 'Meeting scheduled successfully',
      bookingId: booking._id,
      meetingLink: meetingLink || null,
      info: meetingLink ? undefined : 'Meeting link will be sent manually later.',
    });
  } catch (err: unknown) {
    console.error('[bookings/schedule] CRITICAL ERROR:', err);
    return dbSafeError(err);
  }
}
