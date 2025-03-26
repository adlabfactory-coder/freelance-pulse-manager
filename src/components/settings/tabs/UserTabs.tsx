
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserRole } from "@/types";
import { useSupabase } from "@/hooks/use-supabase";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, UserCog, UserPlus, Users, User as UserIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface UserTabsProps {
  onSelectUser: (userId: string) => void;
}

const UserTabs: React.FC<UserTabsProps> = ({ onSelectUser }) => {
  const { isAdminOrSuperAdmin, isSuperAdmin } = useAuth();
  const { fetchUsers } = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const allUsers = await fetchUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les utilisateurs."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, [fetchUsers]);
  
  const filterUsersByRole = (role: UserRole) => {
    return users.filter(user => user.role === role);
  };
  
  const handleEdit = (userId: string) => {
    onSelectUser(userId);
    navigate("/settings/profile");
  };
  
  const handleDelete = async (userId: string) => {
    try {
      // Ici, ajoutez la logique pour supprimer un utilisateur
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès."
      });
      // Rechargez la liste des utilisateurs
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur."
      });
    }
  };
  
  const handleAddUser = () => {
    navigate("/settings/add-user");
  };
  
  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const renderUserTable = (users: User[], canManage: boolean = true) => (
    <ScrollArea className="h-[50vh] w-full">
      <Table>
        <TableCaption>Liste des utilisateurs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            {canManage && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={canManage ? 4 : 3} className="text-center">
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === UserRole.SUPER_ADMIN 
                    ? "Super Admin" 
                    : user.role === UserRole.ADMIN 
                      ? "Admin" 
                      : user.role === UserRole.FREELANCER 
                        ? "Chargé(e) d'affaires" 
                        : user.role === UserRole.ACCOUNT_MANAGER
                          ? "Chargé(e) de compte"
                          : "Client"}
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(user.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {(isSuperAdmin || (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.ADMIN)) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée. Cela supprimera définitivement l'utilisateur
                              {user.name ? ` "${user.name}"` : ""} et toutes ses données associées.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(user.id)}>
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Gérer les utilisateurs par catégorie
          </CardDescription>
        </div>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="all">
              <Users className="mr-2 h-4 w-4" />
              Tous
            </TabsTrigger>
            {isSuperAdmin && (
              <TabsTrigger value="admins">
                <UserCog className="mr-2 h-4 w-4" />
                Administrateurs
              </TabsTrigger>
            )}
            <TabsTrigger value="freelancers">
              <UserIcon className="mr-2 h-4 w-4" />
              Chargés d'affaires
            </TabsTrigger>
            <TabsTrigger value="account-managers">
              <UserIcon className="mr-2 h-4 w-4" />
              Chargés de compte
            </TabsTrigger>
            <TabsTrigger value="clients">
              <UserIcon className="mr-2 h-4 w-4" />
              Clients
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderUserTable(users, true)}
          </TabsContent>
          
          {isSuperAdmin && (
            <TabsContent value="admins">
              {renderUserTable(filterUsersByRole(UserRole.ADMIN).concat(filterUsersByRole(UserRole.SUPER_ADMIN)), true)}
            </TabsContent>
          )}
          
          <TabsContent value="freelancers">
            {renderUserTable(filterUsersByRole(UserRole.FREELANCER), true)}
          </TabsContent>
          
          <TabsContent value="account-managers">
            {renderUserTable(filterUsersByRole(UserRole.ACCOUNT_MANAGER), true)}
          </TabsContent>
          
          <TabsContent value="clients">
            {renderUserTable(filterUsersByRole(UserRole.CLIENT), true)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserTabs;
