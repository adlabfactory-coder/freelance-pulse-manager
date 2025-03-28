
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserRole } from "@/types";
import { USER_ROLE_LABELS } from "@/types/roles";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface UsersListProps {
  onSelectUser: (userId: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdminOrSuperAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simulation de chargement des données
      // Dans une application réelle, remplacer par un appel API
      setTimeout(() => {
        const demoUsers: User[] = [
          {
            id: "user-1",
            name: "John Doe",
            email: "john@adlabhub.com",
            role: UserRole.FREELANCER
          },
          {
            id: "user-2",
            name: "Jane Smith",
            email: "jane@adlabhub.com",
            role: UserRole.ACCOUNT_MANAGER
          },
          {
            id: "user-3",
            name: "Admin User",
            email: "admin@adlabhub.com",
            role: UserRole.ADMIN
          }
        ];
        
        setUsers(demoUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger la liste des utilisateurs."
      });
      setLoading(false);
    }
  };
  
  const handleAddUser = () => {
    navigate("/settings/users/add");
  };
  
  const handleUserClick = (userId: string) => {
    onSelectUser(userId);
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Vérification des permissions administrateur
  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Vous n'avez pas les droits nécessaires pour accéder à cette section.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Tous les utilisateurs enregistrés dans le système
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadUsers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un utilisateur..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{USER_ROLE_LABELS[user.role as UserRole] || "Utilisateur"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;
