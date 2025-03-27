
import React from "react";
import { ApiKey } from "@/types/api-keys";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/format";

interface ApiKeysListProps {
  apiKeys: ApiKey[];
  loading?: boolean;
  onShowKey: (id: string) => void;
  onCopyKey: (key: string) => void;
  onDeleteKey: () => void;
}

const ApiKeysList: React.FC<ApiKeysListProps> = ({
  apiKeys,
  loading = false,
  onShowKey,
  onCopyKey,
  onDeleteKey
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Vous n'avez pas encore de clés API. Créez-en une pour commencer.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Créée le</TableHead>
          <TableHead>Expire le</TableHead>
          <TableHead>Dernière utilisation</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apiKeys.map((apiKey) => (
          <TableRow key={apiKey.id}>
            <TableCell className="font-medium">{apiKey.key_name}</TableCell>
            <TableCell>{formatDate(apiKey.created_at)}</TableCell>
            <TableCell>
              {apiKey.expires_at ? formatDate(apiKey.expires_at) : "Jamais"}
            </TableCell>
            <TableCell>
              {apiKey.last_used ? formatDate(apiKey.last_used) : "Jamais utilisée"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShowKey(apiKey.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopyKey(apiKey.api_key)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette clé API?")) {
                      onDeleteKey();
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ApiKeysList;
