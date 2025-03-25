
import { CommissionTier } from "@/types";

export const getTierLabel = (tier: CommissionTier): string => {
  switch (tier) {
    case CommissionTier.TIER_1:
      return "Palier 1";
    case CommissionTier.TIER_2:
      return "Palier 2";
    case CommissionTier.TIER_3:
      return "Palier 3";
    case CommissionTier.TIER_4:
      return "Palier 4";
    default:
      return "";
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(amount);
};

export const formatPeriod = (startDate: Date, endDate: Date): string => {
  const startMonth = startDate.toLocaleDateString("fr-FR", { month: "long" });
  const endMonth = endDate.toLocaleDateString("fr-FR", { month: "long" });
  const year = startDate.getFullYear();

  return startMonth === endMonth
    ? `${startMonth} ${year}`
    : `${startMonth} - ${endMonth} ${year}`;
};
