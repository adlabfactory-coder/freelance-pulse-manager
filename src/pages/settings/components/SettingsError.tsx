
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Assurons-nous que le type inclut onRetry
export interface SettingsErrorProps {
  error: string;
  onRetry?: () => void;
  details?: string;
}

const SettingsError: React.FC<SettingsErrorProps> = ({ error, onRetry, details }) => {
  return (
    <div className="container py-6">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription className="mt-2">
          {error}
          {details && (
            <div className="mt-2 text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
              <pre className="whitespace-pre-wrap">{details}</pre>
            </div>
          )}
        </AlertDescription>
      </Alert>
      
      {onRetry && (
        <Button onClick={onRetry} className="mt-2">
          Réessayer
        </Button>
      )}
    </div>
  );
};

export default SettingsError;
