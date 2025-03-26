
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Assurons-nous que le type inclut onRetry
export interface SettingsErrorProps {
  error: string;
  onRetry?: () => void;
}

const SettingsError: React.FC<SettingsErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="container py-6">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription className="mt-2">
          {error}
        </AlertDescription>
      </Alert>
      
      {onRetry && (
        <Button onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  );
};

export default SettingsError;
