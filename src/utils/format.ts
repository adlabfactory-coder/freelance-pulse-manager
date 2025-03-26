export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

// Add formatDate function 
export function formatDate(date: Date): string {
  if (!date) return 'N/A';
  
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date instanceof Date ? date : new Date(date));
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}
