/**
 * googleMeet.ts
 *
 * Creates a Google Calendar event with an automatically-generated Meet link.
 * Uses getGoogleAuthClient() which handles token refresh, DB persistence and
 * all invalid_grant scenarios automatically.
 */

import { google } from 'googleapis';
import { randomUUID } from 'crypto';
import { getGoogleAuthClient } from '@/lib/googleClient';

export interface MeetDetails {
  title: string;
  dateIso: string;       // ISO date string, e.g. "2027-06-15T00:00:00.000Z"
  time: string;          // "10:00 AM" or "14:30"
  durationMinutes?: number; // default 30
  guestEmail?: string;
}

/**
 * Creates a Google Calendar event and returns the Google Meet link.
 *
 * @throws if Google is not connected, token is invalid, or Calendar API fails.
 */
export async function createGoogleMeetLink(details: MeetDetails): Promise<string> {
  // Get a fully-authenticated, token-refreshed OAuth2 client
  const auth = await getGoogleAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });

  const baseDate     = new Date(details.dateIso);
  const startDateTime = parseDateWithTime(baseDate, details.time);
  const duration     = (details.durationMinutes ?? 30) * 60 * 1000;
  const endDateTime  = new Date(startDateTime.getTime() + duration);
  const requestId    = randomUUID();

  try {
    const response = await calendar.events.insert({
      calendarId:            'primary',
      conferenceDataVersion: 1,         // required to generate Meet link
      sendUpdates:           'all',     // send invite emails to attendees
      requestBody: {
        summary:  details.title,
        description: details.guestEmail
          ? `Consultation booked by: ${details.guestEmail}`
          : undefined,

        start: { dateTime: startDateTime.toISOString(), timeZone: 'UTC' },
        end:   { dateTime: endDateTime.toISOString(),   timeZone: 'UTC' },

        attendees: details.guestEmail
          ? [{ email: details.guestEmail }]
          : undefined,

        conferenceData: {
          createRequest: {
            requestId,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    const meetLink = response.data.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === 'video'
    )?.uri;

    if (!meetLink) {
      // Calendar event was created but Meet link was not attached.
      // This can happen if the Google Workspace account does not have Meet enabled,
      // or if conferenceDataVersion was ignored.
      throw new Error(
        'Google Calendar created the event but did not return a Meet link. ' +
        'Ensure the Google account has Google Meet enabled (Workspace or personal).'
      );
    }

    return meetLink;

  } catch (err: unknown) {
    const e = err as { code?: number | string; message?: string; errors?: unknown[] };
    const msg = e.message ?? 'Unknown Google Calendar error';

    // Surface invalid_grant so admins know to reconnect
    if (msg.includes('invalid_grant') || e.code === 401) {
      throw new Error(
        'Google Calendar API: auth expired (invalid_grant). ' +
        'Please reconnect: /api/google/connect'
      );
    }

    console.error('[googleMeet] Calendar API error:', e.errors ?? e);
    throw new Error(`Google Calendar API failed (${e.code ?? '?'}): ${msg}`);
  }
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function parseDateWithTime(base: Date, time: string): Date {
  const d = new Date(base);

  // 12-hour: "3:30 PM"
  const m12 = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (m12) {
    let h = parseInt(m12[1]);
    const min = parseInt(m12[2]);
    const mer = m12[3].toUpperCase();
    if (mer === 'PM' && h !== 12) h += 12;
    if (mer === 'AM' && h === 12) h  = 0;
    d.setUTCHours(h, min, 0, 0);
    return d;
  }

  // 24-hour: "14:30"
  const m24 = time.match(/(\d{1,2}):(\d{2})/);
  if (m24) {
    d.setUTCHours(parseInt(m24[1]), parseInt(m24[2]), 0, 0);
    return d;
  }

  // Fallback: 9 AM UTC
  d.setUTCHours(9, 0, 0, 0);
  return d;
}