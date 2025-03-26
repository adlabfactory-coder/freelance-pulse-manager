
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/types";
import { USER_ROLE_LABELS } from "@/types/roles";
import useUsersDataLoader from "@/pages/settings/hooks/useUsersDataLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const UsersByRole: React.FC = () => {
  const { users, loading, error, loadUsers } = useUsersDataLoader();
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  const getUsersByRole = (role: UserRole): User[] => {
    return users.filter(user => user.role === role);
  };

  const handleEditUser = (userId: string) => {
    navigate(`/settings/users/edit/${userId}`);
  };

  const handleAddUser = () => {
    navigate("/settings/users/add");
  };
  
  const handleRefreshUsers = () => {
    loadUsers();
    toast({
      title: "Rafraîchissement des données",
      description: "Récupération des utilisateurs en cours...",
    });
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Simulation de suppression pour la démo
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès (simulation)",
      });
      // Dans une implémentation réelle, il faudrait appeler l'API
      await loadUsers(); // Recharger la liste après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs par rôle</CardTitle>
          <CardDescription>Chargement en cours...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
          <CardDescription>Impossible de charger les utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={handleRefreshUsers}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Utilisateurs par rôle</CardTitle>
          <CardDescription>Liste complète des utilisateurs par rôle</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshUsers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button onClick={handleAddUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedRole} onValueChange={setSelectedRole}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tous les utilisateurs</TabsTrigger>
            {Object.values(UserRole).map(role => (
              <TabsTrigger key={role} value={role}>
                {USER_ROLE_LABELS[role]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
          </TabsContent>

          {Object.values(UserRole).map(role => (
            <TabsContent key={role} value={role}>
              <UserTable 
                users={getUsersByRole(role)} 
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                emptyMessage={`Aucun utilisateur avec le rôle ${USER_ROLE_LABELS[role]}`}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface UserTableProps {
  users: User[];
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  emptyMessage?: string;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onEdit, 
  onDelete,
  emptyMessage = "Aucun utilisateur trouvé" 
}) => {
  return (
    <Table>
      <TableCaption>
        {users.length === 0 ? emptyMessage : `Total: ${users.length} utilisateurs`}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center h-24">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          users.map(user => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{USER_ROLE_LABELS[user.role as UserRole]}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(user.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(user.id)}>Supprimer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UsersByRole;
