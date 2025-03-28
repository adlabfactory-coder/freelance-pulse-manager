import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

/**
 * Get the start and end dates of a month
 */
export const getMonthDates = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
};

/**
 * Get all days between two dates
 */
export const getDaysBetweenDates = (startDate: Date, endDate: Date) => {
  return eachDayOfInterval({ start: startDate, end: endDate });
};
