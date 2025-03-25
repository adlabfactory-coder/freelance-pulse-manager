
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { User, UserRole } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { getMockUsers } from "@/utils/supabase-mock-data";

interface UsersManagementProps {
  onSelectUser: (userId: string) => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ onSelectUser }) => {
  const { fetchUsers } = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchUsersData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      // Tentative de récupération depuis Supabase
      const fetchedUsers = await fetchUsers();
      console.info("Utilisateurs récupérés:", fetchedUsers);
      
      if (fetchedUsers && fetchedUsers.length > 0) {
        setUsers(fetchedUsers);
      } else {
        // Utilisation des données de démo en cas d'échec ou pas de données
        const demoUsers = getMockUsers();
        setUsers(demoUsers);
        toast({
          variant: "default",
          title: "Mode démo activé",
          description: "Utilisation des données de démonstration car aucun utilisateur n'a été trouvé.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      // Fallback vers les données de démo
      const demoUsers = getMockUsers();
      setUsers(demoUsers);
      setHasError(true);
      toast({
        variant: "default",
        title: "Mode démo activé",
        description: "Utilisation des données de démonstration pour les utilisateurs.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const handleUserClick = (user: User) => {
    onSelectUser(user.id);
  };

  const handleRetry = () => {
    fetchUsersData();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Liste de tous les utilisateurs de l'application
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRetry}
          className="h-8 gap-1"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Actualiser
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <div>Chargement des utilisateurs...</div>
          </div>
        ) : hasError ? (
          <div className="text-center py-4 space-y-4">
            <div className="text-amber-500">
              Données de démonstration chargées (impossible de se connecter à Supabase)
            </div>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-400px)] min-h-[300px]">
            <Table>
              <TableCaption>Tous les utilisateurs de votre application.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Calendly</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} onClick={() => handleUserClick(user)} className="cursor-pointer hover:bg-muted">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === UserRole.ADMIN 
                        ? "Administrateur" 
                        : user.role === UserRole.FREELANCER 
                          ? "Commercial" 
                          : "Client"}
                    </TableCell>
                    <TableCell>{user.calendly_enabled ? "Activé" : "Désactivé"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
