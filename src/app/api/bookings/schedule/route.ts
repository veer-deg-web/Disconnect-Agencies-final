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
    const rawBody = (await req.json()) as BookingPayload;
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

    // Create a unique Google Meet link via Calendar API
    const meetingLink = await createGoogleMeetLink({
      title: `${serviceTitle} Consultation – ${name}`,
      dateIso,
      time,
      guestEmail: email,
    });

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

    // Persist booking
    const booking = await Booking.create({
      name, email, category, serviceTitle,
      dateIso, dateLabel, time, notes,
      meetingLink,
      adminEmailsNotified: adminEmails,
    });

    const mailDetails = { name, email, serviceTitle, dateLabel, time, notes, meetingLink };

    // Send emails in parallel
    await Promise.all([
      sendBookingScheduledEmailToUser(mailDetails),
      adminEmails.length
        ? sendBookingScheduledEmailToAdmins(adminEmails, mailDetails)
        : Promise.resolve(),
    ]);

    return NextResponse.json({
      message: 'Meeting scheduled successfully',
      bookingId: booking._id,
      meetingLink,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to schedule meeting';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
