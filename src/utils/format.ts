
/**
 * Fonctions utilitaires pour le formatage de données
 */

// Fonction pour formater une date au format français (DD/MM/YYYY)
export const formatDateToFrench = (date: string | Date): string => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    console.error('Invalid date:', date);
    return 'Date invalide';
  }
  
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Fonction pour formater l'heure (HH:MM)
export const formatTime = (date: string | Date): string => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    console.error('Invalid date for time formatting:', date);
    return '--:--';
  }
  
  return d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// Fonction pour formater la date (format simple)
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    console.error('Invalid date:', date);
    return 'Date invalide';
  }
  
  return d.toLocaleDateString('fr-FR');
};

// Fonction pour formater un montant (en euros)
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

// Fonction pour formater un montant (alias pour formatAmount)
export const formatCurrency = (amount: number): string => {
  return formatAmount(amount);
};

// Fonction pour formater un pourcentage
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Fonction pour formater un numéro de téléphone français
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Formater selon le modèle français (XX XX XX XX XX)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  // Si le numéro n'a pas 10 chiffres, le retourner tel quel
  return phone;
};
