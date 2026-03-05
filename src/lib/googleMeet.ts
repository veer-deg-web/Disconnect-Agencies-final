import { google } from 'googleapis';
import { randomUUID } from 'crypto';

/**
 * Creates a Google Calendar event with a Google Meet link and returns the meet URL.
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL  – service account client_email
 *   GOOGLE_PRIVATE_KEY            – service account private_key (with \n escaped as \\n in env)
 *   GOOGLE_CALENDAR_ID            – usually the admin's Google Calendar email or 'primary'
 */
export async function createGoogleMeetLink(details: {
  title: string;
  dateIso: string;   // ISO date string e.g. "2025-06-15T00:00:00.000Z"
  time: string;      // human-readable, e.g. "3:00 PM"
  durationMinutes?: number;
  guestEmail?: string;
}): Promise<string> {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

  if (!serviceAccountEmail || !privateKey) {
    throw new Error(
      'Google service account credentials are not configured. ' +
      'Add GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY to .env.local'
    );
  }

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const calendar = google.calendar({ version: 'v3', auth });

  // Parse the date and time into a proper start/end datetime
  const baseDate = new Date(details.dateIso);

  // Parse time string like "3:00 PM" or "15:00"
  const startDateTime = parseDateWithTime(baseDate, details.time);
  const durationMs = (details.durationMinutes ?? 60) * 60 * 1000;
  const endDateTime = new Date(startDateTime.getTime() + durationMs);

  const requestId = randomUUID(); // unique per request, required by Google

  const attendees = details.guestEmail
    ? [{ email: details.guestEmail }]
    : [];

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    requestBody: {
      summary: details.title,
      start: { dateTime: startDateTime.toISOString(), timeZone: 'UTC' },
      end: { dateTime: endDateTime.toISOString(), timeZone: 'UTC' },
      attendees,
      conferenceData: {
        createRequest: {
          requestId,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
  });

  const meetLink = event.data.conferenceData?.entryPoints?.find(
    (ep) => ep.entryPointType === 'video'
  )?.uri;

  if (!meetLink) {
    throw new Error('Google Calendar returned no Meet link. Ensure Google Meet is enabled on the calendar.');
  }

  return meetLink;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function parseDateWithTime(base: Date, timeStr: string): Date {
  const result = new Date(base);

  // Handle "3:00 PM" / "3:00 AM"
  const ampmMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const meridiem = ampmMatch[3].toUpperCase();
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    result.setUTCHours(hours, minutes, 0, 0);
    return result;
  }

  // Handle "15:00" 24-hour format
  const h24Match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (h24Match) {
    result.setUTCHours(parseInt(h24Match[1], 10), parseInt(h24Match[2], 10), 0, 0);
    return result;
  }

  // Fallback: 9 AM
  result.setUTCHours(9, 0, 0, 0);
  return result;
}
