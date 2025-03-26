
import { CommissionTier } from "@/types/commissions";

/**
 * Convertit une chaîne de tier de la base de données vers l'énumération
 */
export const mapTierToEnum = (tierString: string): string => {
  switch(tierString.toLowerCase()) {
    case 'bronze':
      return CommissionTier.TIER_1;
    case 'silver':
      return CommissionTier.TIER_2;
    case 'gold':
      return CommissionTier.TIER_3;
    case 'platinum':
      return CommissionTier.TIER_4;
    default:
      return tierString;
  }
};

/**
 * Convertit une valeur d'énumération vers une chaîne pour la base de données
 */
export const mapEnumToTier = (tierEnum: string): string => {
  switch(tierEnum) {
    case CommissionTier.TIER_1:
      return 'bronze';
    case CommissionTier.TIER_2:
      return 'silver';
    case CommissionTier.TIER_3:
      return 'gold';
    case CommissionTier.TIER_4:
      return 'platinum';
    default:
      return tierEnum;
  }
};
