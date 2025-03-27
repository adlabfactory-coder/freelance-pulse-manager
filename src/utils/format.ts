
/**
 * Utility functions for formatting dates, currency, and other data
 */

/**
 * Format a date to a user-friendly string
 * @param date Date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Date invalide';
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('fr-FR', defaultOptions).format(dateObj);
}

/**
 * Format a date to a French format (DD/MM/YYYY)
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDateToFrench(date: Date | string | undefined): string {
  return formatDate(date);
}

/**
 * Format a date for API submission (ISO format)
 * @param date Date to format
 * @param timeString Time string in format HH:MM
 * @returns ISO formatted date string
 */
export function formatDateForAPI(date: Date | undefined, timeString?: string): string | undefined {
  if (!date) return undefined;
  
  const formattedDate = date.toISOString().split('T')[0];
  
  if (timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const dateWithTime = new Date(date);
    dateWithTime.setHours(hours, minutes, 0, 0);
    return dateWithTime.toISOString();
  }
  
  return formattedDate + 'T00:00:00.000Z';
}

/**
 * Format a time from a date object
 * @param date Date to extract time from
 * @returns Formatted time string (HH:MM)
 */
export function formatTime(date: Date | string | undefined): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Heure invalide';
  }
  
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(dateObj);
}

/**
 * Format a number as currency (MAD)
 * @param amount Number to format
 * @param options Intl.NumberFormatOptions
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | undefined | null, options?: Intl.NumberFormatOptions): string {
  if (amount === undefined || amount === null) return '0,00 MAD';
  
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  };
  
  return new Intl.NumberFormat('fr-FR', defaultOptions).format(amount);
}

/**
 * Format a percentage
 * @param value Number to format as percentage
 * @returns Formatted percentage string
 */
export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null) return '0%';
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

/**
 * Format a duration in minutes to hours and minutes
 * @param minutes Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number | undefined): string {
  if (minutes === undefined) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} h`;
  } else {
    return `${hours} h ${mins} min`;
  }
}

/**
 * Truncate text to a maximum length and add ellipsis if needed
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
}
