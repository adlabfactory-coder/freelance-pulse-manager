
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
