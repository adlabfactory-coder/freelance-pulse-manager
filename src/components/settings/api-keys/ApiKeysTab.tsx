
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ApiKeysList from "./ApiKeysList";
import CreateApiKeyDialog from "./CreateApiKeyDialog";
import { fetchApiKeysByUserId } from "@/services/api-key-service";
import { ApiKey } from "@/types/api-keys";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ApiKeysTab: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const hasApiKeyAccess = isAdmin || isSuperAdmin;

  const loadApiKeys = async () => {
    if (user && hasApiKeyAccess) {
      setLoading(true);
      try {
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
    loadApiKeys();
  };

  const handleApiKeyDeleted = () => {
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
        <CreateApiKeyDialog userId={user?.id || ""} onApiKeyCreated={handleApiKeyCreated} />
      </CardHeader>
      <CardContent>
        <ApiKeysList 
          apiKeys={apiKeys} 
          loading={loading} 
          onApiKeyDeleted={handleApiKeyDeleted} 
        />
      </CardContent>
    </Card>
  );
};

export default ApiKeysTab;
