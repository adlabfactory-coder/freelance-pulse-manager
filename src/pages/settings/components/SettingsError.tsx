
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Database, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { setupDatabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

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
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupStatus, setSetupStatus] = useState<string[]>([]);
  
  const handleDatabaseSetup = async () => {
    setIsSettingUp(true);
    setSetupProgress(5);
    setSetupStatus(["Démarrage de l'initialisation..."]);
    
    try {
      // Fonction pour mettre à jour le statut et la progression
      const updateStatus = (message: string, progressIncrement: number) => {
        setSetupStatus(prev => [...prev, message]);
        setSetupProgress(prev => Math.min(prev + progressIncrement, 95));
      };
      
      updateStatus("Connexion à Supabase...", 10);
      
      // Appel à la fonction d'initialisation de la base de données avec suivi de progression
      const result = await setupDatabase({
        onTableCreated: (tableName) => {
          updateStatus(`Table '${tableName}' créée avec succès`, 10);
        }
      });
      
      setSetupProgress(100);
      
      if (result.success) {
        updateStatus("Configuration terminée avec succès!", 5);
        toast({
          title: "Base de données configurée",
          description: "Les tables ont été créées avec succès. Rechargement des données...",
        });
        
        // Attendre un peu avant de recharger pour que l'utilisateur puisse voir le toast et le statut
        setTimeout(() => {
          onRetry();
        }, 3000);
      } else {
        updateStatus(`Erreur: ${result.message}`, 0);
        toast({
          variant: "destructive",
          title: "Erreur de configuration",
          description: result.message,
        });
        console.error('Détails de l\'erreur:', result.details);
      }
    } catch (error) {
      console.error('Erreur lors de la configuration de la base de données:', error);
      setSetupStatus(prev => [...prev, "Une erreur inattendue s'est produite"]);
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
          
          {isSettingUp && (
            <div className="w-full space-y-4">
              <Progress value={setupProgress} className="w-full" />
              <div className="max-h-40 overflow-y-auto border rounded-md p-2 w-full">
                {setupStatus.map((status, index) => (
                  <div key={index} className="text-xs py-1 flex items-center">
                    {index === setupStatus.length - 1 && setupProgress < 100 ? (
                      <RefreshCw className="h-3 w-3 mr-2 animate-spin text-primary" />
                    ) : (
                      <Check className="h-3 w-3 mr-2 text-green-500" />
                    )}
                    {status}
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
            <Button onClick={onRetry} variant="outline" disabled={isSettingUp}>
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
