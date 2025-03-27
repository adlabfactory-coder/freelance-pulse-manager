
import { CommissionTier, CommissionTierValues } from "@/types/commissions";

/**
 * Converts a tier string from the database to the application's tier format
 * @param tierString The tier as a string
 * @returns The tier in application format
 */
export const mapTierToEnum = (tierString: string): string => {
  if (!tierString) return CommissionTierValues.BRONZE;

  // Convert to lowercase for comparison
  const normalizedTier = tierString.toLowerCase();

  switch(normalizedTier) {
    case 'bronze':
      return CommissionTierValues.BRONZE;
    case 'silver':
      return CommissionTierValues.SILVER;
    case 'gold':
      return CommissionTierValues.GOLD;
    case 'platinum':
      return CommissionTierValues.PLATINUM;
    default:
      // If it's already a tier value, return as is
      if (Object.values(CommissionTierValues).includes(tierString as CommissionTier)) {
        return tierString;
      }
      console.warn(`Unknown tier value: ${tierString}, defaulting to BRONZE`);
      return CommissionTierValues.BRONZE;
  }
};

/**
 * Converts an application tier value to a database string
 * @param tierEnum The tier in application format
 * @returns The tier as a string for the database
 */
export const mapEnumToTier = (tierEnum: string): string => {
  if (!tierEnum) return 'bronze';
  
  // Normalize the tier
  const normalizedTier = tierEnum.toLowerCase();
  
  switch(normalizedTier) {
    case CommissionTierValues.BRONZE.toLowerCase():
      return 'bronze';
    case CommissionTierValues.SILVER.toLowerCase():
      return 'silver';
    case CommissionTierValues.GOLD.toLowerCase():
      return 'gold';
    case CommissionTierValues.PLATINUM.toLowerCase():
      return 'platinum';
    default:
      // If it's already a database value, return as is in lowercase
      return tierEnum.toLowerCase();
  }
};

/**
 * Gets the display label for a tier
 * @param tier The tier as a string
 * @returns The tier label for display
 */
export const getTierLabel = (tier: string): string => {
  if (!tier) return 'Bronze';
  
  // Normalize the tier
  const normalizedTier = typeof tier === 'string' ? tier.toLowerCase() : '';
  
  switch(normalizedTier) {
    case 'bronze':
    case CommissionTierValues.BRONZE.toLowerCase():
      return 'Bronze';
    case 'silver': 
    case CommissionTierValues.SILVER.toLowerCase():
      return 'Argent';
    case 'gold':
    case CommissionTierValues.GOLD.toLowerCase():
      return 'Or';
    case 'platinum':
    case CommissionTierValues.PLATINUM.toLowerCase():
      return 'Platine';
    case 'diamond':
    case CommissionTierValues.DIAMOND.toLowerCase():
      return 'Diamant';
    default:
      console.warn(`Unknown tier label: ${tier}`);
      return tier || 'Unknown';
  }
};
