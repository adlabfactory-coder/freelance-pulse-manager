
import React from "react";
import CommissionSettingsForm from "./commission/CommissionSettingsForm";
import LoadingIndicator from "./database/LoadingIndicator";
import { useCommissionRules } from "@/hooks/commission/use-commission-rules";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const CommissionSettings: React.FC = () => {
  const { loading, error, commissionRules } = useCommissionRules();

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des paliers de commission: {error}
        </AlertDescription>
      </Alert>
    );
  }

  // Vérifier si tous les paliers sont présents
  const tiersCount = commissionRules?.length || 0;
  
  return (
    <div className="space-y-6">
      {tiersCount < 4 && (
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Attention: Seulement {tiersCount} paliers sur 4 sont configurés. Veuillez configurer tous les paliers.
          </AlertDescription>
        </Alert>
      )}
      <CommissionSettingsForm />
    </div>
  );
};

export default CommissionSettings;
