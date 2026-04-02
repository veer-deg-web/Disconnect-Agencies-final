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

export const dynamic = 'force-dynamic';

interface BookingPayload {
  name: string;
  email: string;
  category: CategoryType;
  date: string;
  time: string;
  notes?: string;
}

function isValidCategory(value: string): value is CategoryType {
  return ['aimodels', 'appdev', 'webdev', 'uiux', 'seo', 'cloud'].includes(value);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await safeParseJson<BookingPayload>(req);
    if (!rawBody) {
      return NextResponse.json({ error: 'Invalid or empty request body' }, { status: 400 });
    }
    const body = sanitizeInput(rawBody);

    const name = body.name || '';
    const email = body.email || '';
    const category = body.category;
    const time = body.time || '';
    const notes = body.notes || '';

    if (!name || !/^[A-Za-z ]+$/.test(name)) {
      return NextResponse.json({ error: 'Valid name is required' }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!category || !isValidCategory(category)) {
      return NextResponse.json({ error: 'Valid category is required' }, { status: 400 });
    }
    if (!body.date || Number.isNaN(Date.parse(body.date))) {
      return NextResponse.json({ error: 'Valid date is required' }, { status: 400 });
    }
    if (!time) {
      return NextResponse.json({ error: 'Time is required' }, { status: 400 });
    }

    await dbConnect();

    const selectedDate = new Date(body.date);
    const dateIso = selectedDate.toISOString();
    const dateLabel = selectedDate.toLocaleDateString('en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    const serviceTitle = serviceData[category].title;

    // 1. Attempt to create Google Meet link with a 10s timeout
    let meetingLink = '';
    try {
      const meetPromise = createGoogleMeetLink({
        title: `${serviceTitle} Consultation – ${name}`,
        dateIso,
        time,
        guestEmail: email,
      });

      // Timeout after 10 seconds to avoid hanging the entire request
      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('Google Meet generation timed out')), 10000)
      );

      meetingLink = await Promise.race([meetPromise, timeoutPromise]);
    } catch (meetErr) {
      console.error('[bookings/schedule] Google Meet generation failed or timed out:', meetErr);
      // We continue without a link — better to have a booking without a link than no booking at all.
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
          .map((e) => e.trim().toLowerCase())
          .filter((e) => isValidEmail(e))
      )
    );

    // 2. Persist booking (This is the critical part)
    const booking = await Booking.create({
      name, email, category, serviceTitle,
      dateIso, dateLabel, time, notes,
      meetingLink,
      adminEmailsNotified: adminEmails,
    });

    // 3. Attempt to send emails (background — don't block the response / don't fail on error)
    const mailDetails = { name, email, serviceTitle, dateLabel, time, notes, meetingLink };
    
    // We don't await this directly in a way that blocks the 200 response if it fails,
    // but we want to ensure it's at least triggered.
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
      info: meetingLink ? undefined : 'Meeting link will be sent manually later.'
    });
  } catch (err: unknown) {
    console.error('[bookings/schedule] CRITICAL ERROR:', err);
    const message = err instanceof Error ? err.message : 'Failed to schedule meeting';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
