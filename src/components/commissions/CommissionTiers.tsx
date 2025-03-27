
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommissionRule, CommissionTier, CommissionTierValues } from "@/types/commissions";

interface CommissionTiersProps {
  commissionRules: CommissionRule[];
  formatCurrency: (amount: number) => string;
  getTierLabel: (tier: string) => string;
}

// Fonction utilitaire pour obtenir la classe CSS en fonction du niveau
const getTierBadgeClass = (tier: string): string => {
  switch (tier) {
    case CommissionTierValues.BRONZE:
      return "bg-amber-800 hover:bg-amber-700";
    case CommissionTierValues.SILVER:
      return "bg-gray-400 hover:bg-gray-300";
    case CommissionTierValues.GOLD:
      return "bg-amber-400 hover:bg-amber-300";
    case CommissionTierValues.PLATINUM:
      return "bg-cyan-600 hover:bg-cyan-500";
    case CommissionTierValues.DIAMOND:
      return "bg-purple-600 hover:bg-purple-500";
    default:
      return "bg-gray-600 hover:bg-gray-500";
  }
};

const CommissionTiers: React.FC<CommissionTiersProps> = ({ 
  commissionRules, 
  formatCurrency, 
  getTierLabel 
}) => {
  // Tri des règles par nombre minimum de contrats
  const sortedRules = [...commissionRules].sort((a, b) => a.minContracts - b.minContracts);
  
  // Obtenir les règles disponibles pour l'affichage
  const getAvailableRules = (): CommissionRule[] => {
    if (sortedRules.length === 0) {
      // Si aucune règle n'est définie, utiliser des règles par défaut pour la démo
      return [
        {
          id: "1",
          tier: CommissionTierValues.BRONZE,
          percentage: 2,
          unit_amount: 0,
          minContracts: 1,
          maxContracts: 5
        },
        {
          id: "2",
          tier: CommissionTierValues.SILVER,
          percentage: 3,
          unit_amount: 0,
          minContracts: 6,
          maxContracts: 10
        },
        {
          id: "3",
          tier: CommissionTierValues.GOLD,
          percentage: 5,
          unit_amount: 100,
          minContracts: 11,
          maxContracts: 20
        },
        {
          id: "4",
          tier: CommissionTierValues.PLATINUM,
          percentage: 7,
          unit_amount: 250,
          minContracts: 21,
          maxContracts: 30
        },
        {
          id: "5",
          tier: CommissionTierValues.DIAMOND,
          percentage: 10,
          unit_amount: 500,
          minContracts: 31,
          maxContracts: null
        }
      ];
    }
    return sortedRules;
  };
  
  // Obtenir les règles à afficher (réelles ou de démo)
  const rulesToShow = getAvailableRules();

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground mb-3">
          Niveaux de commission
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {rulesToShow.map((rule) => (
            <div 
              key={rule.id}
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Badge className={`mb-2 ${getTierBadgeClass(rule.tier)}`}>
                {getTierLabel(rule.tier)}
              </Badge>
              <div className="text-2xl font-bold">{rule.percentage}%</div>
              {rule.unit_amount > 0 && (
                <div className="text-sm text-muted-foreground">
                  + {formatCurrency(rule.unit_amount)} fixe
                </div>
              )}
              <div className="mt-2 text-xs text-center text-muted-foreground">
                {rule.minContracts === rule.maxContracts ? (
                  `${rule.minContracts} contrats`
                ) : rule.maxContracts ? (
                  `${rule.minContracts} à ${rule.maxContracts} contrats`
                ) : (
                  `${rule.minContracts}+ contrats`
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionTiers;
