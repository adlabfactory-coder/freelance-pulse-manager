
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date et une heure pour l'API
 * @param date La date à formater
 * @param time L'heure au format HH:MM
 * @returns La date formatée pour l'API ou null si les paramètres sont invalides
 */
export const formatDateForAPI = (date?: Date, time?: string): string | null => {
  if (!date || !time) return null;
  
  try {
    // Extraire les heures et minutes du format HH:MM
    const [hours, minutes] = time.split(':').map(part => parseInt(part, 10));
    
    // Créer une nouvelle date avec les heures et minutes spécifiées
    const dateWithTime = new Date(date);
    dateWithTime.setHours(hours);
    dateWithTime.setMinutes(minutes);
    
    // Formatter la date en ISO pour l'API
    return dateWithTime.toISOString();
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error);
    return null;
  }
};

/**
 * Formate une date en format français
 * @param date La date à formater
 * @returns La date formatée en français (ex: "12 janvier 2023")
 */
export const formatDateToFrench = (date: Date): string => {
  if (!isValid(date)) return "Date invalide";
  return format(date, 'dd MMMM yyyy', { locale: fr });
};

/**
 * Formate une heure (extrait d'une Date)
 * @param date La date contenant l'heure à formater
 * @returns L'heure au format HH:MM
 */
export const formatTime = (date: Date): string => {
  if (!isValid(date)) return "--:--";
  return format(date, 'HH:mm');
};

/**
 * Formate un montant en devise (MAD par défaut)
 * @param amount Le montant à formater
 * @param currency La devise (MAD par défaut)
 * @returns Le montant formaté (ex: "1 234,56 MAD")
 */
export const formatCurrency = (amount: number, currency: string = 'MAD'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formate une date
 * @param date La date à formater
 * @param formatStr Format de date personnalisé (par défaut: dd/MM/yyyy)
 * @returns La date formatée
 */
export const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy'): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValid(dateObj)) return "Date invalide";
  
  return format(dateObj, formatStr, { locale: fr });
};
