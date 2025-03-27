
/**
 * Formatte une date en format français
 */
export const formatDate = (date: Date): string => {
  try {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

/**
 * Formatte un montant en euros
 */
export const formatCurrency = (amount: number): string => {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Erreur de formatage de devise:', error);
    return `${amount} €`;
  }
};

/**
 * Formatte un pourcentage
 */
export const formatPercent = (value: number): string => {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  } catch (error) {
    console.error('Erreur de formatage de pourcentage:', error);
    return `${value}%`;
  }
};
