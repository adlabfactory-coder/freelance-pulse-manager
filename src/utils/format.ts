
/**
 * Formats a number as a currency value in MAD (Moroccan Dirham)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(amount);
};

/**
 * Formats a number as a money value without currency symbol
 * @param amount - The amount to format
 * @returns Formatted money string
 */
export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a date to a localized string format
 * @param date - The date to format (Date object or string)
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "N/A";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return dateObj.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

/**
 * Formats period dates (start and end)
 * @param start - Start date
 * @param end - End date
 * @returns Formatted period string
 */
export const formatPeriod = (start: Date, end: Date): string => {
  return `${formatDate(start)} - ${formatDate(end)}`;
};
