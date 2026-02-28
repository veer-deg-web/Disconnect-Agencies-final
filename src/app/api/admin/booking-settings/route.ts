import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BookingSettings from '@/models/BookingSettings';
import { verifyAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

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

async function getOrCreateSettings() {
  await dbConnect();
  let settings = await BookingSettings.findOne();
  if (!settings) {
    settings = await BookingSettings.create({ meetingLink: '', adminEmails: [] });
  }
  return settings;
}

export async function GET(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const settings = await getOrCreateSettings();
    return NextResponse.json({
      settings: {
        meetingLink: settings.meetingLink || '',
        adminEmails: settings.adminEmails || [],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to load settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { meetingLink, adminEmails } = (await req.json()) as {
      meetingLink: string;
      adminEmails: string[];
    };

    const safeLink = (meetingLink || '').trim();
    if (!safeLink || !isValidUrl(safeLink)) {
      return NextResponse.json({ error: 'Enter a valid meeting link' }, { status: 400 });
    }

    const uniqueEmails = Array.from(
      new Set(
        (Array.isArray(adminEmails) ? adminEmails : [])
          .map((email) => email.trim().toLowerCase())
          .filter((email) => isValidEmail(email))
      )
    );

    const settings = await getOrCreateSettings();
    settings.meetingLink = safeLink;
    settings.adminEmails = uniqueEmails;
    await settings.save();

    return NextResponse.json({
      settings: {
        meetingLink: settings.meetingLink,
        adminEmails: settings.adminEmails,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to save settings' }, { status: 500 });
  }
}
