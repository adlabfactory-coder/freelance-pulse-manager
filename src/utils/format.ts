
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date au format français lisible
 */
export const formatDateToFrench = (date: Date | string): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.warn("Date invalide fournie pour formatDateToFrench:", date);
    return '-';
  }
  
  return format(dateObj, 'dd MMMM yyyy', { locale: fr });
};

/**
 * Formate une date et une heure au format API ISO 8601
 */
export const formatDateForAPI = (date: Date, timeString: string): string | null => {
  try {
    if (!date || !timeString) return null;
    
    // Vérifier le format du temps (HH:MM)
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
      console.error("Format d'heure invalide:", timeString);
      return null;
    }
    
    // Extraire les heures et minutes
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Créer une nouvelle date avec les heures et minutes spécifiées
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    
    // Formater en ISO
    return dateTime.toISOString();
  } catch (error) {
    console.error("Erreur lors du formatage de la date et de l'heure:", error);
    return null;
  }
};

/**
 * Formate une date pour l'affichage dans l'interface utilisateur
 */
export const formatDateForDisplay = (date: Date | string): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.warn("Date invalide fournie pour formatDateForDisplay:", date);
    return '-';
  }
  
  return format(dateObj, 'dd/MM/yyyy', { locale: fr });
};

/**
 * Formate une heure pour l'affichage dans l'interface utilisateur
 */
export const formatTimeForDisplay = (date: Date | string): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.warn("Date invalide fournie pour formatTimeForDisplay:", date);
    return '-';
  }
  
  return format(dateObj, 'HH:mm', { locale: fr });
};

/**
 * Parse une chaîne de date au format français
 */
export const parseFrenchDate = (dateString: string): Date | null => {
  try {
    return parse(dateString, 'dd/MM/yyyy', new Date(), { locale: fr });
  } catch (error) {
    console.error("Erreur lors de l'analyse de la date française:", error);
    return null;
  }
};
