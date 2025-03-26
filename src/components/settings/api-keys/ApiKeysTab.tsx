
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Plus, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { fetchApiKeysByUserId, createApiKey, deleteApiKey } from "@/services/api-key-service";
import { ApiKey } from "@/types";
import { formatDate } from "@/utils/date-utils";

const ApiKeysTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  // Fonction de chargement des clés API
  const loadApiKeys = async () => {
    if (!user || !user.id) return;
    
    // Ne charger qu'une seule fois
    if (loadAttempt > 0) return;
    setLoadAttempt(1);
    
    setLoading(true);
    setError(null);
    
    try {
      // Utiliser la fonction de service API avec l'UUID correct
      const keys = await fetchApiKeysByUserId(user.id);
      setApiKeys(keys);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des clés API:", err);
      setError(err.message || "Impossible de récupérer les clés API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, [user]);

  const handleCreateApiKey = async () => {
    if (!user || !user.id || !newKeyName.trim()) return;
    
    try {
      const result = await createApiKey(user.id, newKeyName);
      
      if (result.success && result.apiKey) {
        setNewApiKey(result.apiKey);
        setApiKeys([...apiKeys, result.keyData]);
        setNewKeyName("");
        toast({
          title: "Clé API créée",
          description: "Votre nouvelle clé API a été créée avec succès.",
        });
      } else {
        throw new Error(result.error || "Impossible de créer la clé API");
      }
    } catch (err: any) {
      console.error("Erreur lors de la création de la clé API:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la création de la clé API.",
      });
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!user || !user.id) return;
    
    try {
      const result = await deleteApiKey(keyId, user.id);
      
      if (result.success) {
        setApiKeys(apiKeys.filter(key => key.id !== keyId));
        toast({
          title: "Clé API supprimée",
          description: "La clé API a été supprimée avec succès.",
        });
      } else {
        throw new Error(result.error || "Impossible de supprimer la clé API");
      }
    } catch (err: any) {
      console.error("Erreur lors de la suppression de la clé API:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la suppression de la clé API.",
      });
    }
  };

  const handleCopyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Clé API copiée",
      description: "La clé API a été copiée dans le presse-papier.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clés API</CardTitle>
        <CardDescription>
          Gérez vos clés API pour accéder à l'API AdLab Hub
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Label htmlFor="apiKeyName">Nom de la clé API</Label>
              <Input
                id="apiKeyName"
                placeholder="Exemple: Intégration CRM"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <Button 
              className="mt-[21px]" 
              onClick={() => {
                handleCreateApiKey();
                setDialogOpen(true);
              }}
              disabled={!newKeyName.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Créer une clé API
            </Button>
          </div>

          {apiKeys.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Dernière utilisation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.key_name}</TableCell>
                    <TableCell>{formatDate(key.created_at)}</TableCell>
                    <TableCell>{key.last_used ? formatDate(key.last_used) : "Jamais"}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteApiKey(key.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {loading ? "Chargement des clés API..." : "Aucune clé API créée"}
            </div>
          )}
        </div>

        <Dialog open={dialogOpen && newApiKey !== null} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle clé API créée</DialogTitle>
              <DialogDescription>
                Copiez cette clé API maintenant. Vous ne pourrez plus la voir après avoir fermé cette fenêtre.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center space-x-2 my-4">
              <Input
                readOnly
                value={newApiKey || ""}
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => newApiKey && handleCopyApiKey(newApiKey)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <Alert className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Conservez cette clé en lieu sûr. Pour des raisons de sécurité, nous ne la stockons pas en texte brut et ne pouvons pas la récupérer.
              </AlertDescription>
            </Alert>
            
            <DialogFooter>
              <Button 
                onClick={() => {
                  setDialogOpen(false);
                  setNewApiKey(null);
                }}
              >
                J'ai copié ma clé
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ApiKeysTab;
