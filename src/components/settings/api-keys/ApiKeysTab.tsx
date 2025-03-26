
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ApiKey } from "@/types/api-keys";
import { 
  fetchApiKeysByUserId, 
  createApiKey, 
  deleteApiKey 
} from "@/services/api-key-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Plus, AlertTriangle } from "lucide-react";
import ApiKeysList from "./ApiKeysList";
import CreateApiKeyDialog from "./CreateApiKeyDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ApiKeysTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);

  const loadApiKeys = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const keys = await fetchApiKeysByUserId(user.id);
      setApiKeys(keys);
    } catch (error) {
      console.error("Erreur lors du chargement des clés API:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos clés API. Veuillez réessayer plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, [user?.id]);

  const handleCreateKey = async (name: string, expiresAt?: Date) => {
    if (!user?.id) return;
    
    try {
      const newKey = await createApiKey({
        userId: user.id,
        keyName: name,
        expiresAt
      });
      
      if (newKey) {
        setApiKeys([newKey, ...apiKeys]);
        toast({
          title: "Clé API créée",
          description: "Votre nouvelle clé API a été créée avec succès.",
        });
        setCreateDialogOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la clé API:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la clé API. Veuillez réessayer plus tard.",
      });
    }
  };

  const handleShowKey = (id: string) => {
    setVisibleKeyId(visibleKeyId === id ? null : id);
  };

  const handleCopyKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Clé copiée",
      description: "La clé API a été copiée dans le presse-papiers.",
    });
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const success = await deleteApiKey(id);
      
      if (success) {
        setApiKeys(apiKeys.filter(key => key.id !== id));
        toast({
          title: "Clé API supprimée",
          description: "La clé API a été supprimée avec succès.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la clé API:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la clé API. Veuillez réessayer plus tard.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Clés API</h2>
        <p className="text-muted-foreground mt-1">
          Gérez les clés API pour connecter des applications externes à votre compte
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vos clés API</CardTitle>
            <CardDescription>
              Créez et gérez vos clés API pour les intégrations externes
            </CardDescription>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle clé
          </Button>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Les clés API permettent un accès complet à votre compte. Ne les partagez jamais et stockez-les de manière sécurisée.
            </AlertDescription>
          </Alert>

          <ApiKeysList 
            apiKeys={apiKeys.map(key => ({
              ...key,
              apiKey: visibleKeyId === key.id ? key.apiKey : key.apiKey
            }))}
            onShowKey={handleShowKey}
            onCopyKey={handleCopyKey}
            onDeleteKey={handleDeleteKey}
          />
        </CardContent>
      </Card>

      <CreateApiKeyDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onSubmit={handleCreateKey}
      />
    </div>
  );
};

export default ApiKeysTab;
