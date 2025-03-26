
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommissionSettings from "@/components/settings/CommissionSettings";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CommissionSettingsTab: React.FC = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
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
        </CardHeader>
        <CardContent>
          <CommissionSettings />
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionSettingsTab;
