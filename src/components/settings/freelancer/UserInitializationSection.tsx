
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";

interface UserInitializationSectionProps {
  isInitializing: boolean;
  isInitialized: boolean;
  initError: string | null;
  onInitialize: () => Promise<void>;
  onReset: () => void;
}

const UserInitializationSection: React.FC<UserInitializationSectionProps> = ({
  isInitializing,
  isInitialized,
  initError,
  onInitialize,
  onReset
}) => {
  return (
    <div className="mb-6">
      <Alert variant="default">
        <Info className="h-4 w-4" />
        <AlertTitle>Initialisation des utilisateurs</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>Vous pouvez créer automatiquement les utilisateurs standards (freelancers, chargés de compte, administrateurs)</p>
          <div className="flex gap-2">
            <Button 
              onClick={onInitialize} 
              disabled={isInitializing}
              variant="default"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initialisation en cours...
                </>
              ) : (
                "Initialiser les utilisateurs"
              )}
            </Button>
            {isInitialized && (
              <Button variant="outline" onClick={onReset}>
                Réinitialiser
              </Button>
            )}
          </div>
          {initError && (
            <p className="text-destructive text-sm">{initError}</p>
          )}
          {isInitialized && (
            <p className="text-green-600 text-sm">Utilisateurs initialisés avec succès</p>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default UserInitializationSection;
