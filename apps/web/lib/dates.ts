import { addDays, startOfDay } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

export const formatDateKey = (date: Date, timezone: string) =>
  formatInTimeZone(date, timezone, 'yyyy-MM-dd');

export const startOfTodayInZone = (date: Date, timezone: string) =>
  startOfDay(toZonedTime(date, timezone));

export const getPayWindow = (now: Date, nextPayDate: Date, timezone: string) => {
  const start = startOfTodayInZone(now, timezone);
  const end = startOfDay(toZonedTime(nextPayDate, timezone));
  return { start, end };
};

export const getWeekStart = (now: Date, timezone: string) =>
  startOfDay(addDays(startOfTodayInZone(now, timezone), -6));