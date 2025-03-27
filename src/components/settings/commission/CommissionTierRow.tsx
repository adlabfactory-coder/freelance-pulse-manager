
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CommissionTier } from "@/types/commissions";
import { CommissionRuleForm } from "./types";
import { getTierLabel } from "./TierMapper";

interface CommissionTierRowProps {
  tier: CommissionRuleForm;
  index: number;
  onInputChange: (index: number, field: keyof CommissionRuleForm, value: string) => void;
}

const CommissionTierRow: React.FC<CommissionTierRowProps> = ({ 
  tier, 
  index, 
  onInputChange 
}) => {
  // Vérifie si c'est le dernier palier (pour désactiver le champ max si nécessaire)
  const isLastTier = tier.tier === CommissionTier.TIER_4;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-b pb-4">
      <div>
        <Label className="text-base font-medium">
          {getTierLabel(tier.tier)}
        </Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`unit_amount-${index}`}>Commission par contrat (MAD)</Label>
        <Input 
          id={`unit_amount-${index}`} 
          value={tier.unit_amount} 
          onChange={(e) => onInputChange(index, 'unit_amount', e.target.value)}
          type="number"
          min="0"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`min-${index}`}>Contrats minimum</Label>
        <Input 
          id={`min-${index}`} 
          value={tier.minContracts} 
          onChange={(e) => onInputChange(index, 'minContracts', e.target.value)}
          type="number"
          min="0"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`max-${index}`}>Contrats maximum</Label>
        <Input 
          id={`max-${index}`} 
          value={tier.maxContracts || ''} 
          onChange={(e) => onInputChange(index, 'maxContracts', e.target.value)}
          type="number"
          min="0"
          placeholder={isLastTier ? "Illimité" : ""}
          disabled={isLastTier}
        />
      </div>
    </div>
  );
};

export default CommissionTierRow;
