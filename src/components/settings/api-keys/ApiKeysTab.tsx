
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ApiKeysList from "./ApiKeysList";
import CreateApiKeyDialog from "./CreateApiKeyDialog";
import { fetchApiKeysByUserId } from "@/services/api-key-service";
import { ApiKey } from "@/types/api-keys";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ApiKeysTab: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const hasApiKeyAccess = isAdmin || isSuperAdmin;

  const loadApiKeys = async () => {
    if (user && hasApiKeyAccess) {
      setLoading(true);
      try {
        console.log("Chargement des clés API pour l'utilisateur:", user.id);
        const keys = await fetchApiKeysByUserId(user.id);
        setApiKeys(keys);
      } catch (error) {
        console.error("Erreur lors du chargement des clés API:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, [user, hasApiKeyAccess]);

  const handleApiKeyCreated = () => {
    console.log("Clé API créée, rechargement de la liste");
    loadApiKeys();
    setDialogOpen(false);
  };

  const handleApiKeyDeleted = () => {
    console.log("Clé API supprimée, rechargement de la liste");
    loadApiKeys();
  };

  if (!hasApiKeyAccess) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Accès restreint</AlertTitle>
        <AlertDescription>
          Seuls les administrateurs et super administrateurs peuvent gérer les clés API.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Clés API</CardTitle>
          <CardDescription>
            Gérez vos clés API pour accéder aux services de l'application.
          </CardDescription>
        </div>
        <Button variant="default" size="sm" onClick={() => {
          console.log("Ouverture du dialogue de création de clé API");
          setDialogOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Créer une clé API
        </Button>
      </CardHeader>
      <CardContent>
        <ApiKeysList 
          apiKeys={apiKeys} 
          loading={loading}
          onShowKey={(id) => console.log("Afficher la clé:", id)} 
          onCopyKey={(key) => {
            navigator.clipboard.writeText(key);
            toast({
              title: "Clé API copiée",
              description: "La clé API a été copiée dans le presse-papier."
            });
          }}
          onDeleteKey={handleApiKeyDeleted}
        />
      </CardContent>
      
      <CreateApiKeyDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(name, expiresAt) => {
          console.log("Création d'une clé API:", name, expiresAt);
          // Ici vous devriez appeler votre API pour créer une clé
          handleApiKeyCreated();
        }}
      />
    </Card>
  );
};

export default ApiKeysTab;
