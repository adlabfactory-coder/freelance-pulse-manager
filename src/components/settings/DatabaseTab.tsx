
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { enableRealtimeForTables } from "@/services/supabase/setup/enable-realtime";
import { initializeDatabase, checkDatabaseStatus } from "@/services/supabase/setup";
import { Separator } from "@/components/ui/separator";
import DatabaseStatusBadge from "./database/DatabaseStatusBadge";
import DatabaseStatusTable from "./database/DatabaseStatusTable";
import ConnectionErrorAlert from "./database/ConnectionErrorAlert";
import LoadingIndicator from "./database/LoadingIndicator";
import useDatabaseStatus from "./database/useDatabaseStatus";

const DatabaseTab = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const {
    status,
    isLoading,
    refreshing,
    connectionError,
    tablesStatus,
    handleRefresh
  } = useDatabaseStatus();

  // Conversion de l'état en flags booléens pour simplifier l'interface
  const isConnected = status === "ok" || status === "partial";
  const needsSetup = status === "not_configured" || status === "partial";
  const isCheckingConnection = isLoading;

  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [initializationDetails, setInitializationDetails] = useState<any[]>([]);
  const [enablingRealtime, setEnablingRealtime] = useState(false);

  const handleInitializeDatabase = async () => {
    if (!isAdmin && !isSuperAdmin) {
      toast({
        variant: "destructive",
        title: "Permission refusée",
        description: "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
      });
      return;
    }

    setIsInitializing(true);
    setInitializationError(null);
    setInitializationDetails([]);

    try {
      const result = await initializeDatabase({
        onTableCreated: (tableName) => {
          setInitializationDetails((prev) => [...prev, { table: tableName, status: "created" }]);
        },
      });

      if (result.success) {
        toast({
          title: "Base de données initialisée",
          description: "La base de données a été initialisée avec succès.",
        });
      } else {
        setInitializationError(result.message || "Erreur lors de l'initialisation de la base de données.");
        setInitializationDetails(result.details || []);
        toast({
          variant: "destructive",
          title: "Erreur d'initialisation",
          description: result.message || "Erreur lors de l'initialisation de la base de données.",
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de l'initialisation de la base de données:", error);
      setInitializationError(error.message || "Une erreur s'est produite.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'initialisation de la base de données.",
      });
    } finally {
      setIsInitializing(false);
    }
  };
  
  const handleEnableRealtime = async () => {
    if (!isAdmin && !isSuperAdmin) {
      toast({
        variant: "destructive",
        title: "Permission refusée",
        description: "Vous n'avez pas les droits nécessaires pour effectuer cette action."
      });
      return;
    }
    
    setEnablingRealtime(true);
    try {
      const result = await enableRealtimeForTables([
        'contacts',
        'appointments',
        'quotes'
      ]);
      
      if (result.success) {
        toast({
          title: "Configuration réussie",
          description: "Le suivi en temps réel a été activé pour les tables nécessaires."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de configuration",
          description: result.message
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de l'activation de Realtime:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'activation du suivi en temps réel."
      });
    } finally {
      setEnablingRealtime(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>État de la connexion à la base de données</CardTitle>
          <CardDescription>
            Vérifiez l'état de la connexion à votre base de données Supabase.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-4">
          {isCheckingConnection ? (
            <LoadingIndicator />
          ) : (
            <>
              <div className="mb-4 flex items-center">
                <span className="font-medium mr-3">Statut global:</span>
                <DatabaseStatusBadge status={status} />
              </div>
              
              {connectionError && (
                <ConnectionErrorAlert error={connectionError} />
              )}
              
              {tablesStatus.length > 0 && (
                <DatabaseStatusTable 
                  tablesStatus={tablesStatus} 
                  isLoading={isLoading} 
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {needsSetup && (
        <Card>
          <CardHeader>
            <CardTitle>Initialisation de la base de données</CardTitle>
            <CardDescription>
              Initialisez les tables et fonctions nécessaires pour le bon
              fonctionnement de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isInitializing ? (
              <>
                <LoadingIndicator />
                {initializationDetails.length > 0 && (
                  <DatabaseStatusTable 
                    tablesStatus={initializationDetails.map(d => ({
                      table: d.table,
                      exists: d.status === "created"
                    }))}
                    isLoading={false}
                  />
                )}
              </>
            ) : (
              <>
                {initializationError && (
                  <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                    <p>
                      <strong>Erreur:</strong> {initializationError}
                    </p>
                    {initializationDetails.length > 0 && (
                      <DatabaseStatusTable 
                        tablesStatus={initializationDetails.map(d => ({
                          table: d.table,
                          exists: d.status === "created"
                        }))}
                        isLoading={false} 
                      />
                    )}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Cliquez sur le bouton ci-dessous pour initialiser la base de
                  données.
                </p>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleInitializeDatabase}
              disabled={isInitializing || (!isAdmin && !isSuperAdmin)}
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initialisation...
                </>
              ) : (
                "Initialiser la base de données"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Configuration du suivi automatique des contacts</CardTitle>
          <CardDescription>
            Activer le suivi en temps réel des changements de statut des contacts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cette fonctionnalité permet de suivre automatiquement l'évolution des statuts des contacts en fonction des événements :
            <ul className="list-disc pl-5 mt-2">
              <li>Lead → Prospect : Lorsqu'un rendez-vous est validé</li>
              <li>Prospect → Négociation : Lorsqu'un devis est créé</li>
              <li>Négociation → Signé : Lorsqu'un devis est accepté et payé</li>
            </ul>
          </p>
          <p className="text-sm text-muted-foreground">
            Elle permet également de recevoir des notifications pour les devis en attente depuis plus d'une semaine.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleEnableRealtime} 
            disabled={enablingRealtime || (!isAdmin && !isSuperAdmin)}
          >
            {enablingRealtime ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Configuration...
              </>
            ) : (
              "Activer le suivi automatique"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DatabaseTab;
