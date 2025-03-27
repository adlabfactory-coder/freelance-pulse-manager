
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
 * Formatte une date en format français avec jour et mois en lettres
 */
export const formatDateToFrench = (date: Date): string => {
  try {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

/**
 * Formatte une heure en format HH:MM
 */
export const formatTime = (date: Date): string => {
  try {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Erreur de formatage d\'heure:', error);
    return 'Heure invalide';
  }
};

/**
 * Formatte une date pour l'API (format ISO sans timezone)
 */
export const formatDateForAPI = (date: Date): string => {
  try {
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Erreur de formatage de date pour API:', error);
    return '';
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
