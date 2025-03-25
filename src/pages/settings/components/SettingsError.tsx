
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
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
