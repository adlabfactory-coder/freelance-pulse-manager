
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CommissionSettings from "@/components/settings/CommissionSettings";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

const CommissionSettingsTab: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;

  if (!isAdminOrSuperAdmin) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès restreint</AlertTitle>
          <AlertDescription>
            Seuls les administrateurs peuvent gérer les paliers de commission.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration des commissions</CardTitle>
          <CardDescription>
            Gérez les règles de calcul des commissions pour les freelances.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-100">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              <div className="font-medium mb-1">Principe de commissionnement</div>
              <p>
                Le système attribue un montant fixe par contrat validé en fonction du palier atteint.
                Les paliers sont déterminés par le nombre total de contrats validés dans le mois.
              </p>
            </AlertDescription>
          </Alert>
          
          <CommissionSettings />
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionSettingsTab;
