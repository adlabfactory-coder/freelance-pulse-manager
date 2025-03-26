
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/types";
import { fetchUsers } from "@/services/supabase-user-service";
import { USER_ROLE_LABELS } from "@/types/roles";

const UsersByRole: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la liste des utilisateurs."
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [toast]);

  const getUsersByRole = (role: UserRole): User[] => {
    return users.filter(user => user.role === role);
  };

  const handleEditUser = (userId: string) => {
    navigate(`/settings/users/edit/${userId}`);
  };

  const handleAddUser = () => {
    navigate("/settings/users/add");
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Utilisateurs par rôle</CardTitle>
          <CardDescription>Liste complète des utilisateurs par rôle</CardDescription>
        </div>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tous les utilisateurs</TabsTrigger>
            {Object.values(UserRole).map(role => (
              <TabsTrigger key={role} value={role}>
                {USER_ROLE_LABELS[role]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <UserTable users={users} onEdit={handleEditUser} />
          </TabsContent>

          {Object.values(UserRole).map(role => (
            <TabsContent key={role} value={role}>
              <UserTable 
                users={getUsersByRole(role)} 
                onEdit={handleEditUser}
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
  emptyMessage?: string;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onEdit, 
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
