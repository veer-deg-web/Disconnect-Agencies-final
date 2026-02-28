import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import BookingSettings from '@/models/BookingSettings';
import { CategoryType, serviceData } from '@/components/data/serviceData';
import {
  sendBookingScheduledEmailToAdmins,
  sendBookingScheduledEmailToUser,
} from '@/lib/email';

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

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BookingPayload;

    const name = body.name?.trim() || '';
    const email = body.email?.trim().toLowerCase() || '';
    const category = body.category;
    const time = body.time?.trim() || '';
    const notes = body.notes?.trim() || '';

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

    let settings = await BookingSettings.findOne();
    if (!settings) {
      settings = await BookingSettings.create({ meetingLink: '', adminEmails: [] });
    }

    if (!settings.meetingLink || !isValidUrl(settings.meetingLink)) {
      return NextResponse.json(
        { error: 'Meeting link is not configured. Please ask admin to update it.' },
        { status: 400 }
      );
    }

    const selectedDate = new Date(body.date);
    const dateIso = selectedDate.toISOString();
    const dateLabel = selectedDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const serviceTitle = serviceData[category].title;

    const configuredAdminFallback = (process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '')
      .trim()
      .toLowerCase();

    const adminEmails = Array.from(
      new Set(
        [
          ...(settings.adminEmails || []),
          configuredAdminFallback,
        ]
          .map((entry) => entry.trim().toLowerCase())
          .filter((entry) => isValidEmail(entry))
      )
    );

    const booking = await Booking.create({
      name,
      email,
      category,
      serviceTitle,
      dateIso,
      dateLabel,
      time,
      notes,
      meetingLink: settings.meetingLink,
      adminEmailsNotified: adminEmails,
    });

    await sendBookingScheduledEmailToUser({
      name,
      email,
      serviceTitle,
      dateLabel,
      time,
      notes,
      meetingLink: settings.meetingLink,
    });

    if (adminEmails.length) {
      await sendBookingScheduledEmailToAdmins(adminEmails, {
        name,
        email,
        serviceTitle,
        dateLabel,
        time,
        notes,
        meetingLink: settings.meetingLink,
      });
    }

    return NextResponse.json({
      message: 'Meeting scheduled successfully',
      bookingId: booking._id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to schedule meeting' },
      { status: 500 }
    );
  }
}
