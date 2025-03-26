
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CommissionTier, CommissionRule } from "@/types/commissions";

interface CommissionTiersProps {
  commissionRules: CommissionRule[];
  formatCurrency: (amount: number) => string;
  getTierLabel: (tier: CommissionTier) => string;
}

const CommissionTiers: React.FC<CommissionTiersProps> = ({ 
  commissionRules, 
  formatCurrency, 
  getTierLabel 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {commissionRules.map((rule) => (
        <Card key={rule.tier}>
          <CardHeader className="pb-2">
            <CardTitle>{getTierLabel(rule.tier)}</CardTitle>
            <CardDescription>
              {rule.tier === CommissionTier.TIER_1
                ? `Jusqu'à ${rule.maxContracts} contrats`
                : rule.maxContracts
                ? `De ${rule.minContracts} à ${rule.maxContracts} contrats`
                : `${rule.minContracts}+ contrats`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(rule.amount || 0)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              par contrat
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommissionTiers;
