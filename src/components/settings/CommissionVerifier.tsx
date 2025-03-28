
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCommissions } from "@/hooks/commission/use-commission-rules";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CommissionRule, CommissionTier } from "@/types/commissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface TierVerificationResult {
  tier: CommissionTier;
  exists: boolean;
  percentage: number | null;
  unitAmount: number | null;
  minContracts: number | null;
  maxContracts: number | null;
}

const CommissionVerifier: React.FC = () => {
  const { commissionRules, loading, error } = useCommissions();
  const [verificationResults, setVerificationResults] = useState<TierVerificationResult[]>([]);
  const [verificationScore, setVerificationScore] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const expectedTiers = [
    { tier: "bronze" as CommissionTier, minPercentage: 5, maxPercentage: 15 },
    { tier: "silver" as CommissionTier, minPercentage: 10, maxPercentage: 20 },
    { tier: "gold" as CommissionTier, minPercentage: 15, maxPercentage: 25 },
    { tier: "platinum" as CommissionTier, minPercentage: 20, maxPercentage: 30 }
  ];

  const verifyCommissionSystem = () => {
    setIsVerifying(true);
    
    // Simulation d'une vérification asynchrone
    setTimeout(() => {
      if (!commissionRules || commissionRules.length === 0) {
        setVerificationResults(
          expectedTiers.map(tier => ({
            tier: tier.tier,
            exists: false,
            percentage: null,
            unitAmount: null,
            minContracts: null,
            maxContracts: null
          }))
        );
        setVerificationScore(0);
        setIsVerifying(false);
        return;
      }

      const results = expectedTiers.map(expected => {
        const rule = commissionRules.find(r => r.tier === expected.tier);
        return {
          tier: expected.tier,
          exists: !!rule,
          percentage: rule?.percentage || null,
          unitAmount: rule?.unit_amount || null,
          minContracts: rule?.minContracts || null,
          maxContracts: rule?.maxContracts || null
        };
      });

      setVerificationResults(results);
      
      // Calcul du score de vérification
      const existingTiers = results.filter(r => r.exists).length;
      const validPercentages = results.filter(r => {
        if (!r.exists || r.percentage === null) return false;
        const expected = expectedTiers.find(e => e.tier === r.tier);
        return expected && r.percentage >= expected.minPercentage && r.percentage <= expected.maxPercentage;
      }).length;
      
      const score = Math.round(((existingTiers / expectedTiers.length) * 0.5 + (validPercentages / expectedTiers.length) * 0.5) * 100);
      setVerificationScore(score);
      
      setIsVerifying(false);
    }, 1000);
  };

  useEffect(() => {
    if (commissionRules && commissionRules.length > 0 && verificationResults.length === 0) {
      verifyCommissionSystem();
    }
  }, [commissionRules]);

  const getTierLabel = (tier: CommissionTier): string => {
    switch (tier) {
      case "bronze": return "Bronze";
      case "silver": return "Argent";
      case "gold": return "Or";
      case "platinum": return "Platine";
      case "diamond": return "Diamant";
      default: return tier;
    }
  };

  const getStatusBadge = (exists: boolean) => {
    if (exists) {
      return <Badge variant="outline" className="bg-green-50 text-green-700">Configuré</Badge>;
    }
    return <Badge variant="outline" className="bg-red-50 text-red-700">Non configuré</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vérification du système de commissions</CardTitle>
        <CardDescription>
          Vérifiez que le système de commission est correctement configuré
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erreur lors du chargement des règles de commission: {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Score de configuration</p>
            <div className="flex items-center gap-2">
              <Progress value={verificationScore} className="h-2 w-[200px]" />
              <span className="text-sm font-medium">{verificationScore}%</span>
            </div>
          </div>
          
          <Button 
            onClick={verifyCommissionSystem} 
            disabled={loading || isVerifying}
          >
            {(loading || isVerifying) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Vérifier
          </Button>
        </div>

        <Separator />

        {loading || isVerifying ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Palier</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Pourcentage</TableHead>
                  <TableHead>Min. Contrats</TableHead>
                  <TableHead>Max. Contrats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verificationResults.length > 0 ? (
                  verificationResults.map((result) => (
                    <TableRow key={result.tier}>
                      <TableCell className="font-medium">{getTierLabel(result.tier)}</TableCell>
                      <TableCell>{getStatusBadge(result.exists)}</TableCell>
                      <TableCell>
                        {result.percentage !== null ? `${result.percentage}%` : "—"}
                      </TableCell>
                      <TableCell>
                        {result.minContracts !== null ? result.minContracts : "—"}
                      </TableCell>
                      <TableCell>
                        {result.maxContracts !== null ? result.maxContracts : "Illimité"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      Cliquez sur "Vérifier" pour analyser le système de commissions
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        {verificationScore > 0 && (
          <div className="mt-4 p-4 rounded-md bg-gray-50">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
              {verificationScore === 100 ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              Résultat de la vérification
            </h4>
            {verificationScore === 100 ? (
              <p className="text-sm text-green-700">
                Le système de commissions est correctement configuré.
              </p>
            ) : verificationScore >= 50 ? (
              <p className="text-sm text-amber-700">
                Le système de commissions est partiellement configuré. Veuillez vérifier les paliers manquants.
              </p>
            ) : (
              <p className="text-sm text-red-700">
                Le système de commissions est mal configuré. Veuillez configurer tous les paliers.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionVerifier;
