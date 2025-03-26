
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/types";
import { USER_ROLE_LABELS } from "@/types/roles";
import useUsersDataLoader from "@/pages/settings/hooks/useUsersDataLoader";
import UserActions from "@/components/settings/UserActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

interface UsersByRoleProps {
  forceUsers?: User[];
}

const UsersByRole: React.FC<UsersByRoleProps> = ({ forceUsers }) => {
  const { users: fetchedUsers, loading, error, loadUsers } = useUsersDataLoader();
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const { role: currentUserRole } = useAuth();
  const users = forceUsers || fetchedUsers;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const getUsersByRole = (role: UserRole): User[] => {
    return users.filter(user => user.role === role);
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
  
  const handleUserUpdated = () => {
    loadUsers();
  };

  if (loading && !forceUsers) {
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

  if (error && !forceUsers) {
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
            <UserTable 
              users={users} 
              currentUserRole={currentUserRole as UserRole} 
              onUserUpdated={handleUserUpdated}
              allUsers={users}
            />
          </TabsContent>

          {Object.values(UserRole).map(role => (
            <TabsContent key={role} value={role}>
              <UserTable 
                users={getUsersByRole(role)} 
                currentUserRole={currentUserRole as UserRole}
                onUserUpdated={handleUserUpdated}
                allUsers={users}
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
  currentUserRole: UserRole;
  onUserUpdated: () => void;
  allUsers: User[];
  emptyMessage?: string;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  currentUserRole,
  onUserUpdated,
  allUsers,
  emptyMessage = "Aucun utilisateur trouvé" 
}) => {
  // Filtrer pour obtenir des superviseurs potentiels (admin ou super_admin)
  const potentialSupervisors = allUsers.filter(
    user => user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ACCOUNT_MANAGER
  );
  
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
          <TableHead>Superviseur</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center h-24">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          users.map(user => {
            // Trouver le superviseur de l'utilisateur s'il en a un
            const supervisor = user.supervisor_id 
              ? allUsers.find(u => u.id === user.supervisor_id) 
              : undefined;
              
            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{USER_ROLE_LABELS[user.role as UserRole]}</TableCell>
                <TableCell>
                  {supervisor 
                    ? `${supervisor.name} (${USER_ROLE_LABELS[supervisor.role as UserRole]})` 
                    : "Aucun"}
                </TableCell>
                <TableCell className="text-right">
                  <UserActions 
                    user={user} 
                    currentUserRole={currentUserRole}
                    onUserUpdated={onUserUpdated}
                    supervisors={potentialSupervisors}
                  />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default UsersByRole;
