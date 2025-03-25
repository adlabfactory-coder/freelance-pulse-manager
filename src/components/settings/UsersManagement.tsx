
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Plus, Trash, UserCog } from "lucide-react";
import { User, UserRole } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UsersManagementProps {
  onSelectUser: (userId: string) => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ onSelectUser }) => {
  const supabase = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersData = await supabase.fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer la liste des utilisateurs.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [supabase]);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return (
          <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
            Administrateur
          </span>
        );
      case UserRole.FREELANCER:
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Commercial
          </span>
        );
      case UserRole.CLIENT:
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            Client
          </span>
        );
      default:
        return null;
    }
  };

  const handleAddUser = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout d'utilisateur sera disponible prochainement.",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un utilisateur
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement des utilisateurs...</div>
      ) : (
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="hidden md:table-cell">
                  Date de création
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.created_at && new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onSelectUser(user.id)}
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
