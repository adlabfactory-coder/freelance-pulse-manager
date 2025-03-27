
import { CommissionTier } from "@/types/commissions";

export interface CommissionRuleForm {
  id?: string;
  tier: string;
  minContracts: number;
  maxContracts?: number | null;
  unit_amount: number;
}

export interface MappingFunctions {
  mapTierToEnum: (tierString: string) => string;
  mapEnumToTier: (tierEnum: string) => string;
}
