
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useCommissionRules } from "@/hooks/commission/use-commission-rules";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const CommissionVerifier: React.FC = () => {
  const { commissionRules, loading, error } = useCommissionRules();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<{
    status: "success" | "error" | "warning" | null;
    message: string;
  } | null>(null);

  const verifyCommissionSystem = async () => {
    setIsVerifying(true);
    
    try {
      // Vérification de base du système de commissions
      if (!commissionRules || commissionRules.length === 0) {
        setVerificationResults({
          status: "error",
          message: "Aucune règle de commission trouvée. Le système de commission ne peut pas fonctionner correctement."
        });
        return;
      }
      
      // Vérifier si les paliers sont cohérents
      let hasBronze = false;
      let hasSilver = false;
      let hasGold = false;
      let hasPlatinum = false;
      
      for (const rule of commissionRules) {
        if (rule.tier === 'bronze') hasBronze = true;
        if (rule.tier === 'silver') hasSilver = true;
        if (rule.tier === 'gold') hasGold = true;
        if (rule.tier === 'platinum') hasPlatinum = true;
      }
      
      if (!hasBronze || !hasSilver || !hasGold || !hasPlatinum) {
        setVerificationResults({
          status: "warning",
          message: "Certains paliers de commission manquent. Pour un système complet, il est recommandé d'avoir les paliers Bronze, Argent, Or et Platine."
        });
        return;
      }
      
      // Vérifier si les montants sont cohérents
      const sortedRules = [...commissionRules].sort((a, b) => (a.minContracts || 0) - (b.minContracts || 0));
      
      for (let i = 0; i < sortedRules.length - 1; i++) {
        const currentRule = sortedRules[i];
        const nextRule = sortedRules[i + 1];
        
        if ((currentRule.maxContracts || 0) >= (nextRule.minContracts || 0)) {
          setVerificationResults({
            status: "warning",
            message: "Il y a des chevauchements dans les plages de contrats des paliers. Cela peut causer des ambiguïtés dans le calcul des commissions."
          });
          return;
        }
      }
      
      setVerificationResults({
        status: "success",
        message: "Le système de commission semble correctement configuré et prêt à être utilisé."
      });
      
      toast.success("Vérification du système de commission réussie");
    } catch (error) {
      console.error("Erreur lors de la vérification du système de commission:", error);
      setVerificationResults({
        status: "error",
        message: "Une erreur s'est produite lors de la vérification du système de commission."
      });
      toast.error("Erreur lors de la vérification du système");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vérification du système de commissions</CardTitle>
        <CardDescription>
          Vérifiez que le système de calcul des commissions est correctement configuré
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-amber-50">
          <AlertDescription>
            Cette vérification contrôle que les paliers de commission sont correctement définis sans chevauchements ni incohérences.
          </AlertDescription>
        </Alert>
        
        {verificationResults && (
          <div className={`p-4 rounded-md ${
            verificationResults.status === "success" ? "bg-green-50" : 
            verificationResults.status === "error" ? "bg-red-50" : "bg-amber-50"
          }`}>
            <div className="flex items-start gap-3">
              {verificationResults.status === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : verificationResults.status === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {verificationResults.status === "success" ? "Système valide" : 
                   verificationResults.status === "error" ? "Problème détecté" : "Attention"}
                </p>
                <p className="text-sm mt-1">{verificationResults.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-2">
          <h3 className="text-sm font-medium mb-2">Paliers de commission configurés:</h3>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">Erreur lors du chargement des paliers</p>
          ) : commissionRules && commissionRules.length > 0 ? (
            <div className="space-y-2">
              {commissionRules.map((rule, index) => (
                <div key={index} className="p-2 border rounded-md flex justify-between items-center">
                  <div>
                    <Badge variant="outline" className="capitalize">
                      {rule.tier}
                    </Badge>
                    <span className="text-sm ml-2">
                      {rule.minContracts} - {rule.maxContracts || "∞"} contrats
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {rule.percentage ? `${rule.percentage}%` : `${rule.unit_amount || 0} €`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun palier configuré</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={verifyCommissionSystem} 
          disabled={isVerifying || loading}
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification...
            </>
          ) : (
            "Vérifier le système"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommissionVerifier;
