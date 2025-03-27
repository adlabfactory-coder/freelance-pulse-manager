
/**
 * Normalise une URL en la convertissant en minuscules et en supprimant les espaces
 * @param url L'URL à normaliser
 * @returns L'URL normalisée
 */
export const normalizeUrl = (url: string): string => {
  return url.trim().toLowerCase();
};

/**
 * Vérifie si une URL est valide
 * @param url L'URL à vérifier
 * @returns true si l'URL est valide, false sinon
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Sanitize une URL en retirant les caractères potentiellement dangereux
 * @param url L'URL à sanitizer
 * @returns L'URL sanitizée
 */
export const sanitizeUrl = (url: string): string => {
  return url.replace(/[^\w\s:/.?&=%-]+/g, '');
};

/**
 * Vérifie si une URL est accessible (renvoie un code HTTP 200)
 * Note: Cette fonction doit être utilisée côté serveur ou dans une fonction edge
 * @param url L'URL à vérifier
 * @returns Promise<boolean> true si l'URL est accessible, false sinon
 */
export const checkLinkStatus = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
