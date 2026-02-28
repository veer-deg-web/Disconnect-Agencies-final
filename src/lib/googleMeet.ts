interface GoogleTokenResponse {
  access_token: string;
}

interface CreateMeetInput {
  customerName: string;
  customerEmail: string;
  serviceTitle: string;
  date: Date;
  timeSlot: string;
  notes?: string;
}

interface CreatedMeet {
  meetingLink: string;
  eventId: string;
}

function parseTimeSlotTo24Hour(timeSlot: string): { hour: number; minute: number } {
  const match = timeSlot.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    throw new Error('Invalid booking time format');
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (hour === 12) hour = 0;
  if (meridiem === 'PM') hour += 12;

  return { hour, minute };
}

function buildDateTimeRange(date: Date, timeSlot: string, durationMinutes: number) {
  const { hour, minute } = parseTimeSlotTo24Hour(timeSlot);

  const start = new Date(date);
  start.setHours(hour, minute, 0, 0);

  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  return { start, end };
}

async function getGoogleAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth credentials are missing');
  }

  const payload = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload,
    cache: 'no-store',
  });

  const tokenData = (await tokenRes.json()) as GoogleTokenResponse & { error?: string };

  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error || 'Unable to get Google access token');
  }

  return tokenData.access_token;
}

function hasGoogleMeetConfig(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN &&
      process.env.GOOGLE_CALENDAR_ID
  );
}

export async function createGoogleMeetForBooking(input: CreateMeetInput): Promise<CreatedMeet | null> {
  if (!hasGoogleMeetConfig()) {
    return null;
  }

  const accessToken = await getGoogleAccessToken();
  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID as string);
  const timezone = process.env.BOOKING_TIMEZONE || 'UTC';
  const durationMinutes = Number(process.env.BOOKING_DURATION_MINUTES || '30');

  const { start, end } = buildDateTimeRange(input.date, input.timeSlot, durationMinutes);

  const body = {
    summary: `Discovery Call - ${input.serviceTitle}`,
    description: [
      `Name: ${input.customerName}`,
      `Email: ${input.customerEmail}`,
      `Service: ${input.serviceTitle}`,
      input.notes ? `Notes: ${input.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    start: { dateTime: start.toISOString(), timeZone: timezone },
    end: { dateTime: end.toISOString(), timeZone: timezone },
    attendees: [{ email: input.customerEmail }],
    conferenceData: {
      createRequest: {
        requestId: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  );

  const data = (await res.json()) as {
    id?: string;
    hangoutLink?: string;
    conferenceData?: {
      entryPoints?: { uri?: string; entryPointType?: string }[];
    };
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(data?.error?.message || 'Failed to create Google Meet event');
  }

  const conferenceEntry = data.conferenceData?.entryPoints?.find(
    (point) => point.entryPointType === 'video'
  );

  const meetingLink = data.hangoutLink || conferenceEntry?.uri;

  if (!meetingLink || !data.id) {
    throw new Error('Google event created without a meet link');
  }

  return { meetingLink, eventId: data.id };
}
