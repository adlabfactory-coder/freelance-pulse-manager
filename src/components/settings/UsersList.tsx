
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, RefreshCw, Search, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import useUsersManagementData from "@/hooks/settings/useUsersManagementData";
import { User } from "@/types";

interface UsersListProps {
  onSelectUser: (userId: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({ onSelectUser }) => {
  const { users, isLoading, hasError, fetchUsersData } = useUsersManagementData();
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdminOrSuperAdmin } = useAuth();
  
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout d'un nouvel utilisateur sera bientôt disponible."
    });
  };

  const handleRefresh = () => {
    fetchUsersData();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
          <div>
            <CardTitle>Utilisateurs</CardTitle>
            <CardDescription>
              Liste complète des utilisateurs de l'application
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {isAdminOrSuperAdmin && (
              <Button onClick={handleAddUser} size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            )}
            <Button onClick={handleRefresh} size="sm" variant="outline">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : hasError ? (
          <div className="text-center py-8 text-destructive">
            <p className="font-medium">Erreur lors du chargement des utilisateurs</p>
            <Button onClick={handleRefresh} variant="outline" className="mt-2">
              Réessayer
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? (
              <p>Aucun utilisateur ne correspond à votre recherche</p>
            ) : (
              <div>
                <p>Aucun utilisateur n'est disponible</p>
                {isAdminOrSuperAdmin && (
                  <Button onClick={handleAddUser} variant="outline" className="mt-2">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Ajouter un utilisateur
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user: User) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-4 border rounded-md hover:bg-accent cursor-pointer"
                onClick={() => onSelectUser(user.id)}
              >
                <div>
                  <p className="font-medium">{user.name || "Utilisateur sans nom"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;
