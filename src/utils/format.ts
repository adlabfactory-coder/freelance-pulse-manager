
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Fonction pour formatter un prix (utilisant également MAD)
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD'
  }).format(price);
}

// Format pour les dates
export function formatDate(date: Date | string): string {
  if (!date) return 'N/A';
  
  try {
    return new Intl.DateTimeFormat('fr-MA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date instanceof Date ? date : new Date(date));
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

// Alias de formatCurrency pour garder la cohérence dans le code
export const formatMoney = formatCurrency;
