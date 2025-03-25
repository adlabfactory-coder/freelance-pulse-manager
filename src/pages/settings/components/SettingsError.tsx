
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Database } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { setupDatabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

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
  const [isSettingUp, setIsSettingUp] = useState(false);
  
  const handleDatabaseSetup = async () => {
    setIsSettingUp(true);
    try {
      const result = await setupDatabase();
      
      if (result.success) {
        toast({
          title: "Base de données configurée",
          description: "Les tables ont été créées avec succès. Rechargement des données...",
        });
        
        // Attendre un peu avant de recharger pour que l'utilisateur puisse voir le toast
        setTimeout(() => {
          onRetry();
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de configuration",
          description: result.message,
        });
        console.error('Détails de l\'erreur:', result.details);
      }
    } catch (error) {
      console.error('Erreur lors de la configuration de la base de données:', error);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur s'est produite lors de la configuration de la base de données.",
      });
    } finally {
      setIsSettingUp(false);
    }
  };
  
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
            Les tables nécessaires ('users', 'contacts', etc.) n'existent pas dans votre projet Supabase.
            Vous pouvez initialiser automatiquement la base de données ou continuer avec les données de démonstration.
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              variant="default"
              onClick={handleDatabaseSetup} 
              disabled={isSettingUp}
            >
              {isSettingUp ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Initialisation...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Initialiser la base de données
                </>
              )}
            </Button>
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer sans initialiser
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsError;
