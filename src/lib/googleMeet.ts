import { google } from "googleapis";
import { randomUUID } from "crypto";
import dbConnect from "@/lib/mongodb";
import GoogleToken from "@/models/GoogleToken";

/**
 * Creates a Google Calendar event with a Meet link, using the stored
 * admin OAuth2 refresh token (written by /api/auth/google/callback).
 */
export async function createGoogleMeetLink(details: {
  title: string;
  dateIso: string;
  time: string;
  durationMinutes?: number;
  guestEmail?: string;
}): Promise<string> {

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Google OAuth env vars missing: set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI in .env.local"
    );
  }

  // Load stored tokens
  await dbConnect();
  const stored = await GoogleToken.findOne().lean();

  if (!stored) {
    throw new Error(
      'Google account not connected. Please go to the Admin panel and click "Connect Google Account".'
    );
  }

  // Build OAuth2 client with stored credentials
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  oauth2Client.setCredentials({
    access_token: stored.accessToken,
    refresh_token: stored.refreshToken,
    expiry_date: stored.expiresAt,
  });

  // When the access token is silently refreshed, persist the new one back to DB
  oauth2Client.on("tokens", async (freshTokens) => {
    try {
      await GoogleToken.findOneAndUpdate(
        {},
        {
          accessToken: freshTokens.access_token ?? stored.accessToken,
          ...(freshTokens.refresh_token
            ? { refreshToken: freshTokens.refresh_token }
            : {}),
          expiresAt: freshTokens.expiry_date ?? stored.expiresAt,
        }
      );
    } catch (e) {
      console.error("Failed to persist refreshed Google token:", e);
    }
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Build start / end times
  const baseDate = new Date(details.dateIso);
  const startDateTime = parseDateWithTime(baseDate, details.time);
  const duration = (details.durationMinutes ?? 30) * 60 * 1000;
  const endDateTime = new Date(startDateTime.getTime() + duration);

  const requestId = randomUUID();

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,

      requestBody: {
        summary: details.title,

        description: details.guestEmail
          ? `Guest Email: ${details.guestEmail}`
          : undefined,

        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "UTC",
        },

        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "UTC",
        },

        attendees: details.guestEmail
          ? [{ email: details.guestEmail }]
          : undefined,

        conferenceData: {
          createRequest: {
            requestId,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    const meetLink = response.data.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video"
    )?.uri;

    if (!meetLink) {
      throw new Error("Google Calendar created the event but did not return a Meet link.");
    }

    return meetLink;

  } catch (error: any) {
    console.error("Google Calendar API error:", error?.errors ?? error);
    throw new Error(
      `Google Calendar API failed (${error.code ?? "?"}): ${error.message}`
    );
  }
}

// ── helpers ────────────────────────────────────────────────────────────────

function parseDateWithTime(baseDate: Date, time: string): Date {
  const result = new Date(baseDate);

  // 12-hour format: "3:30 PM"
  const match12 = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (match12) {
    let hours = parseInt(match12[1]);
    const minutes = parseInt(match12[2]);
    const meridiem = match12[3].toUpperCase();
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    result.setUTCHours(hours, minutes, 0, 0);
    return result;
  }

  // 24-hour format: "15:30"
  const match24 = time.match(/(\d{1,2}):(\d{2})/);
  if (match24) {
    result.setUTCHours(parseInt(match24[1]), parseInt(match24[2]), 0, 0);
    return result;
  }

  // fallback — 9 AM
  result.setUTCHours(9, 0, 0, 0);
  return result;
}