
/**
 * Constantes liées à la devise pour l'application AdLab Hub
 */

// Définition de la devise utilisée dans toute l'application
export const CURRENCY = {
  CODE: 'MAD',
  NAME: 'Dirham marocain',
  SYMBOL: 'MAD',
  LOCALE: 'fr-MA'
};

// Informations sur le format de la devise
export const CURRENCY_FORMAT = {
  DECIMAL_PLACES: 2,
  USE_GROUPING: true
};

/**
 * Formatte un montant en MAD en utilisant les constantes définies
 * Cette fonction est un wrapper autour de la fonction principale formatCurrency 
 * pour assurer la cohérence
 */
export const formatMAD = (amount: number): string => {
  try {
    return new Intl.NumberFormat(CURRENCY.LOCALE, {
      style: 'currency',
      currency: CURRENCY.CODE,
      minimumFractionDigits: CURRENCY_FORMAT.DECIMAL_PLACES,
      maximumFractionDigits: CURRENCY_FORMAT.DECIMAL_PLACES
    }).format(amount);
  } catch (error) {
    console.error('Erreur de formatage de devise:', error);
    return `${amount} ${CURRENCY.SYMBOL}`;
  }
};
