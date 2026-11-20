/**
 * Calendar Event Utilities for AstroVeda Consultations
 * Generates Google Calendar deep links and RFC-5545 compliant .ics calendar files
 */

export interface CalendarEventPayload {
  title: string;
  description: string;
  location: string;
  startsAt: string; // ISO string
  durationMinutes: number;
  reference: string;
}

/**
 * Format ISO date string into Google Calendar compact UTC format: YYYYMMDDTHHmmssZ
 */
function formatUtcCompact(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Build Google Calendar Web Template URL
 */
export function getGoogleCalendarUrl(event: CalendarEventPayload): string {
  const startDate = new Date(event.startsAt);
  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60 * 1000);

  const startUtc = formatUtcCompact(startDate.toISOString());
  const endUtc = formatUtcCompact(endDate.toISOString());

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startUtc}/${endUtc}`,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates and triggers download of a standardized .ics iCalendar file
 */
export function downloadIcsFile(event: CalendarEventPayload): void {
  const startDate = new Date(event.startsAt);
  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60 * 1000);

  const startUtc = formatUtcCompact(startDate.toISOString());
  const endUtc = formatUtcCompact(endDate.toISOString());
  const nowUtc = formatUtcCompact(new Date().toISOString());

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MyGuruji//Vedic Astrology Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.reference}-${startDate.getTime()}@myguruji.com`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${event.title.replace(/[,;]/g, ' ')}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location.replace(/[,;]/g, ' ')}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: MyGuruji Sacred Consultation in 30 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `MyGuruji-${event.reference}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

