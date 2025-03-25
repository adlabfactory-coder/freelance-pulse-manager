
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SettingsErrorProps {
  title?: string;
  description?: string;
  onRetry: () => void;
}

const SettingsError: React.FC<SettingsErrorProps> = ({ 
  title = "Impossible de charger les paramètres",
  description = "Veuillez vérifier votre connexion à Supabase ou réessayer ultérieurement.",
  onRetry 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Une erreur est survenue
        </p>
      </div>
      
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Problème de connexion</AlertTitle>
        <AlertDescription>
          La connexion à Supabase a échoué ou les tables nécessaires n'existent pas.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground max-w-md text-center">
            Vérifiez que les tables nécessaires ('users', 'contacts', etc.) existent dans votre projet Supabase.
            Si vous êtes en mode développement, vous pouvez continuer avec les données de démonstration.
          </div>
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsError;
