
import { CommissionTier } from "@/types/commissions";

/**
 * Convertit une chaîne de tier de la base de données vers l'énumération
 * @param tierString Le tier sous forme de chaîne
 * @returns Le tier sous forme d'énumération
 */
export const mapTierToEnum = (tierString: string): string => {
  if (!tierString) return CommissionTier.TIER_1;

  // Conversion en minuscules pour la comparaison
  const normalizedTier = tierString.toLowerCase();

  switch(normalizedTier) {
    case 'bronze':
      return CommissionTier.TIER_1;
    case 'silver':
      return CommissionTier.TIER_2;
    case 'gold':
      return CommissionTier.TIER_3;
    case 'platinum':
      return CommissionTier.TIER_4;
    default:
      // Si c'est déjà une valeur d'énumération, la renvoyer telle quelle
      if (Object.values(CommissionTier).includes(tierString as CommissionTier)) {
        return tierString;
      }
      console.warn(`Valeur de tier inconnue: ${tierString}, utilisation de TIER_1 par défaut`);
      return CommissionTier.TIER_1;
  }
};

/**
 * Convertit une valeur d'énumération vers une chaîne pour la base de données
 * @param tierEnum Le tier sous forme d'énumération
 * @returns Le tier sous forme de chaîne
 */
export const mapEnumToTier = (tierEnum: string): string => {
  if (!tierEnum) return 'bronze';
  
  // Normalisation du tier
  const normalizedTier = tierEnum.toUpperCase();
  
  switch(normalizedTier) {
    case CommissionTier.TIER_1:
      return 'bronze';
    case CommissionTier.TIER_2:
      return 'silver';
    case CommissionTier.TIER_3:
      return 'gold';
    case CommissionTier.TIER_4:
      return 'platinum';
    default:
      // Si c'est déjà une valeur de base de données, la renvoyer telle quelle en minuscules
      return tierEnum.toLowerCase();
  }
};

/**
 * Obtient le libellé d'affichage d'un tier
 * @param tier Le tier sous forme de chaîne ou d'énumération
 * @returns Le libellé du tier pour l'affichage
 */
export const getTierLabel = (tier: string): string => {
  if (!tier) return 'Bronze';
  
  // Normalisation du tier
  const normalizedTier = typeof tier === 'string' ? tier.toLowerCase() : '';
  
  switch(normalizedTier) {
    case 'bronze':
    case CommissionTier.TIER_1.toLowerCase():
      return 'Bronze';
    case 'silver': 
    case CommissionTier.TIER_2.toLowerCase():
      return 'Argent';
    case 'gold':
    case CommissionTier.TIER_3.toLowerCase():
      return 'Or';
    case 'platinum':
    case CommissionTier.TIER_4.toLowerCase():
      return 'Platine';
    default:
      console.warn(`Libellé de tier inconnu: ${tier}`);
      return tier || 'Inconnu';
  }
};
