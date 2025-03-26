
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
  // Vérifier si nous avons des règles de commission
  if (!commissionRules || commissionRules.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Paliers de Commission</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Chargement des paliers de commission...
          </div>
        </CardContent>
      </Card>
    );
  }

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
                {rule.percentage}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {rule.amount ? formatCurrency(rule.amount) : 'Montant variable'}
              </div>
              <div className="text-xs mt-3 text-muted-foreground">
                {rule.minContracts} contrats minimum
                {rule.maxContracts ? ` - ${rule.maxContracts} contrats maximum` : ' et plus'}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Les commissions sont calculées à la fin de chaque mois en fonction du nombre total de contrats validés.</p>
          <p className="mt-2">Les pourcentages sont appliqués sur le montant total des contrats signés dans la période.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionTiers;
