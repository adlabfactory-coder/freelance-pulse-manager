
import React, { useState } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Database, AlertTriangle, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { createSQLFunctions } from "@/lib/supabase-sql";

const InitializeDatabase: React.FC = () => {
  const supabase = useSupabase();
  const [isInitializing, setIsInitializing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInitialize = async () => {
    setIsInitializing(true);
    setProgress(5);
    setStatusMessages(["Démarrage de l'initialisation de la base de données..."]);
    setError(null);
    
    try {
      // Fonction utilitaire pour mettre à jour le statut et la progression
      const updateStatus = (message: string, progressIncrement: number) => {
        setStatusMessages(prev => [...prev, message]);
        setProgress(prev => Math.min(prev + progressIncrement, 95));
      };
      
      updateStatus("Vérification de la connexion à Supabase...", 10);
      
      // Vérifier la connexion à Supabase
      const connectionStatus = await supabase.checkSupabaseStatus();
      if (!connectionStatus.success) {
        throw new Error(`Connexion à Supabase échouée: ${connectionStatus.message}`);
      }
      
      updateStatus("Connexion à Supabase établie", 10);
      
      // Initialisation des fonctions SQL
      updateStatus("Initialisation des fonctions SQL...", 10);
      const sqlFunctionsResult = await createSQLFunctions();
      
      if (!sqlFunctionsResult.success) {
        throw new Error(`Erreur lors de l'initialisation des fonctions SQL: ${sqlFunctionsResult.message}`);
      }
      
      updateStatus("Fonctions SQL initialisées", 15);
      
      // Vérification de la configuration
      updateStatus("Vérification de la configuration des tables...", 10);
      const dbStatus = await supabase.checkDatabaseStatus();
      
      if (dbStatus.success) {
        updateStatus("Toutes les tables existent déjà", 30);
      } else {
        if (dbStatus.missingTables && dbStatus.missingTables.length > 0) {
          updateStatus(`Tables manquantes: ${dbStatus.missingTables.join(', ')}`, 10);
        }
        
        // Création des tables manquantes
        updateStatus("Création des tables manquantes...", 10);
        const setupResult = await supabase.initializeDatabase({
          onTableCreated: (tableName) => {
            updateStatus(`Table '${tableName}' créée avec succès`, 5);
          }
        });
        
        if (!setupResult.success) {
          throw new Error(`Erreur lors de la création des tables: ${setupResult.message}`);
        }
      }
      
      // Finalisation
      setProgress(100);
      setIsComplete(true);
      updateStatus("Initialisation de la base de données terminée avec succès!", 5);
      
      toast({
        title: "Base de données initialisée",
        description: "La base de données a été configurée avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de l'initialisation de la base de données:", error);
      setError(error.message || "Une erreur inconnue est survenue");
      setStatusMessages(prev => [...prev, `Erreur: ${error.message || "Une erreur inconnue est survenue"}`]);
      
      toast({
        variant: "destructive",
        title: "Erreur d'initialisation",
        description: error.message || "Une erreur inconnue est survenue lors de l'initialisation de la base de données",
      });
    } finally {
      setIsInitializing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Initialisation de la base de données
        </CardTitle>
        <CardDescription>
          Créez toutes les tables nécessaires pour l'application AdLab Hub
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isComplete && !error && (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Initialisation réussie</AlertTitle>
            <AlertDescription>La base de données a été configurée avec succès.</AlertDescription>
          </Alert>
        )}
        
        {(isInitializing || statusMessages.length > 0) && (
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            
            <div className="max-h-40 overflow-y-auto border rounded-md p-2 text-sm">
              {statusMessages.map((message, index) => (
                <div key={index} className="py-1 flex items-center text-xs">
                  {index === statusMessages.length - 1 && isInitializing ? (
                    <RefreshCw className="h-3 w-3 mr-2 animate-spin text-primary" />
                  ) : (
                    <Check className="h-3 w-3 mr-2 text-green-500" />
                  )}
                  {message}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleInitialize} 
          disabled={isInitializing || isComplete}
          className="w-full"
        >
          {isInitializing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Initialisation en cours...
            </>
          ) : isComplete ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Base de données initialisée
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Initialiser la base de données
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InitializeDatabase;
