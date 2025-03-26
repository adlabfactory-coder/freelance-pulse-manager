
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommissionRule, CommissionTier } from "@/types/commissions";

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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Paliers de Commission</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {commissionRules.map((rule) => (
            <div 
              key={rule.id}
              className="border rounded-md p-4 flex flex-col items-center text-center"
            >
              <Badge 
                className={
                  rule.tier === CommissionTier.TIER_1 ? "bg-zinc-200 text-zinc-800 hover:bg-zinc-300" :
                  rule.tier === CommissionTier.TIER_2 ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
                  rule.tier === CommissionTier.TIER_3 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
                  "bg-green-100 text-green-800 hover:bg-green-200"
                }
              >
                {getTierLabel(rule.tier)}
              </Badge>
              <div className="mt-2 text-2xl font-bold">
                {formatCurrency(rule.amount || 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                par contrat
              </div>
              <div className="text-xs mt-3 text-muted-foreground">
                {rule.tier === CommissionTier.TIER_1 && "Jusqu'à 10 contrats par mois"}
                {rule.tier === CommissionTier.TIER_2 && "De 11 à 20 contrats par mois"}
                {rule.tier === CommissionTier.TIER_3 && "De 21 à 30 contrats par mois"}
                {rule.tier === CommissionTier.TIER_4 && "31 contrats et plus par mois"}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Les commissions sont calculées à la fin de chaque mois en fonction du nombre total de contrats validés.</p>
          <p className="mt-2">Les versements sont effectués sur demande après validation par l'administration.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionTiers;
