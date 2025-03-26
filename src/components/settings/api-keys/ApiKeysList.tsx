
import React from "react";
import { ApiKey } from "@/types/api-keys";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Copy, Trash2, Clock } from "lucide-react";
import { formatDate } from "@/utils/format";

interface ApiKeysListProps {
  apiKeys: ApiKey[];
  onShowKey: (id: string) => void;
  onCopyKey: (apiKey: string) => void;
  onDeleteKey: (id: string) => void;
}

const ApiKeysList: React.FC<ApiKeysListProps> = ({
  apiKeys,
  onShowKey,
  onCopyKey,
  onDeleteKey
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Clé API</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                Aucune clé API trouvée. Créez votre première clé API.
              </TableCell>
            </TableRow>
          ) : (
            apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell className="font-medium">{apiKey.keyName}</TableCell>
                <TableCell>
                  {apiKey.apiKey.startsWith("adlabhub_") 
                    ? (
                      <div className="flex items-center">
                        <span className="text-xs font-mono">
                          {apiKey.apiKey.substring(0, 12)}...
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => onShowKey(apiKey.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) 
                    : (
                      <div className="flex items-center">
                        <span className="text-xs font-mono">{apiKey.apiKey}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => onShowKey(apiKey.id)}
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )
                  }
                </TableCell>
                <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                <TableCell>
                  {apiKey.expiresAt 
                    ? (
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                        {formatDate(apiKey.expiresAt)}
                      </div>
                    ) 
                    : "N/A"
                  }
                </TableCell>
                <TableCell>
                  {apiKey.isActive 
                    ? <Badge className="bg-green-500">Active</Badge>
                    : <Badge variant="destructive">Inactive</Badge>
                  }
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7"
                      onClick={() => onCopyKey(apiKey.apiKey)}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copier
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="h-7"
                      onClick={() => onDeleteKey(apiKey.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApiKeysList;
