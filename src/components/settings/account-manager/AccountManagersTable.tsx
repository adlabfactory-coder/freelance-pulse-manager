
import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AccountManager } from "@/hooks/useAccountManagerManagement";

interface AccountManagersTableProps {
  managers: AccountManager[];
  isLoading: boolean;
  isDeleting: boolean;
  onDelete: (id: string) => Promise<void>;
}

const AccountManagersTable: React.FC<AccountManagersTableProps> = ({
  managers,
  isLoading,
  isDeleting,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (managers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun chargé de compte trouvé</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Date de création</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {managers.map((manager) => (
          <TableRow key={manager.id}>
            <TableCell className="font-medium">{manager.name}</TableCell>
            <TableCell>{manager.email}</TableCell>
            <TableCell>
              {manager.createdAt
                ? new Date(manager.createdAt).toLocaleDateString('fr-FR')
                : "Non disponible"}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(manager.id)}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AccountManagersTable;
