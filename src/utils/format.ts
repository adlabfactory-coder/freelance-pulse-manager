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
