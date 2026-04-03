import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BookingSettings from '@/models/BookingSettings';
import { verifyAdminToken } from '@/lib/adminAuth';
import { safeParseJson } from '@/lib/utils';
import { adminBookingSettingsSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    const settings = await getOrCreateSettings();
    return NextResponse.json({
      settings: {
        meetingLink: settings.meetingLink || '',
        adminEmails: settings.adminEmails || [],
      },
    });
  } catch (err: unknown) {
    console.error('Admin booking settings get error:', err);
    return dbSafeError(err);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = adminBookingSettingsSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { meetingLink, adminEmails } = parsed.data;

    const uniqueEmails = Array.from(
      new Set(
        adminEmails
          .map((email: string) => email.trim().toLowerCase())
          .filter((email: string) => isValidEmail(email))
      )
    );

    const settings = await getOrCreateSettings();
    settings.meetingLink = meetingLink;
    settings.adminEmails = uniqueEmails;
    await settings.save();

    return NextResponse.json({
      settings: {
        meetingLink: settings.meetingLink,
        adminEmails: settings.adminEmails,
      },
    });
  } catch (err: unknown) {
    console.error('Admin booking settings update error:', err);
    return dbSafeError(err);
  }
}
