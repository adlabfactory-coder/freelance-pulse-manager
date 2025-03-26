
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommissionRule, CommissionTier } from "@/types/commissions";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  // Utiliser des règles de commission par défaut si aucune n'est fournie
  // Cela permet d'éviter les problèmes d'affichage en cas d'erreur de connexion à la base de données
  const hasRules = commissionRules && commissionRules.length > 0;
  const rules = hasRules ? commissionRules : [
    {
      id: "default-tier-1",
      tier: CommissionTier.TIER_1,
      minContracts: 1,
      maxContracts: 10,
      percentage: 10,
      amount: 500
    },
    {
      id: "default-tier-2",
      tier: CommissionTier.TIER_2,
      minContracts: 11,
      maxContracts: 20,
      percentage: 15,
      amount: 1000
    },
    {
      id: "default-tier-3",
      tier: CommissionTier.TIER_3,
      minContracts: 21,
      maxContracts: 30,
      percentage: 20,
      amount: 1500
    },
    {
      id: "default-tier-4",
      tier: CommissionTier.TIER_4,
      minContracts: 31,
      percentage: 25,
      amount: 2000
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Paliers de Commission</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasRules && (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Impossible de charger les paliers depuis la base de données. Affichage des valeurs par défaut.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rules.map((rule) => (
            <div 
              key={rule.id}
              className="border rounded-md p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
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
                {rule.minContracts} contrat{rule.minContracts > 1 ? 's' : ''} minimum
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
