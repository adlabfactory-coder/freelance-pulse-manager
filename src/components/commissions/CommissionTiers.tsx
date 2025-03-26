
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
  const hasRules = commissionRules && commissionRules.length > 0;
  const tiers = [CommissionTier.TIER_1, CommissionTier.TIER_2, CommissionTier.TIER_3, CommissionTier.TIER_4];
  
  // Assurer que tous les 4 paliers sont disponibles
  let rules = hasRules ? [...commissionRules] : [];
  
  // Si nous n'avons pas les 4 paliers, compléter avec les paliers par défaut
  if (rules.length < 4) {
    const existingTiers = rules.map(rule => rule.tier);
    tiers.forEach(tier => {
      if (!existingTiers.includes(tier)) {
        const defaultRule = getDefaultRule(tier);
        rules.push(defaultRule);
      }
    });
    
    // Trier les règles par niveau minimum de contrats
    rules.sort((a, b) => a.minContracts - b.minContracts);
  }

  console.log("Affichage des règles de commission:", rules);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Paliers de Commission</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasRules && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Utilisation des valeurs de paliers par défaut. Les administrateurs peuvent configurer ces valeurs dans les paramètres.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rules.map((rule, index) => (
            <div 
              key={rule.id || `tier-${index}`}
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
                {formatCurrency(rule.unitAmount || 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                par contrat validé
              </div>
              <div className="text-xs mt-3 text-muted-foreground">
                {rule.minContracts} contrat{rule.minContracts > 1 ? 's' : ''} minimum
                {rule.maxContracts ? ` - ${rule.maxContracts} contrats maximum` : ' et plus'}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Les commissions sont calculées à la fin de chaque mois en fonction du nombre de contrats validés.</p>
          <p className="mt-2">Pour chaque contrat validé dans un palier, une commission fixe est attribuée selon le montant unitaire de ce palier.</p>
          <p className="mt-2 font-medium">Ce système a remplacé l'ancien mode de calcul par pourcentage du montant des contrats.</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Fonctions utilitaires pour générer des règles par défaut
const getDefaultRule = (tier: CommissionTier): CommissionRule => {
  switch (tier) {
    case CommissionTier.TIER_1:
      return {
        id: "default-tier-1",
        tier: CommissionTier.TIER_1,
        minContracts: 1,
        maxContracts: 10,
        percentage: 0,
        unitAmount: 500
      };
    case CommissionTier.TIER_2:
      return {
        id: "default-tier-2",
        tier: CommissionTier.TIER_2,
        minContracts: 11,
        maxContracts: 20,
        percentage: 0,
        unitAmount: 1000
      };
    case CommissionTier.TIER_3:
      return {
        id: "default-tier-3",
        tier: CommissionTier.TIER_3,
        minContracts: 21,
        maxContracts: 30,
        percentage: 0,
        unitAmount: 1500
      };
    case CommissionTier.TIER_4:
      return {
        id: "default-tier-4",
        tier: CommissionTier.TIER_4,
        minContracts: 31,
        percentage: 0,
        unitAmount: 2000
      };
    default:
      return {
        id: "default-unknown",
        tier: CommissionTier.TIER_1,
        minContracts: 1,
        maxContracts: 10,
        percentage: 0,
        unitAmount: 500
      };
  }
};

export default CommissionTiers;
