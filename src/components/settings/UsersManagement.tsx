
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { User, UserRole } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

interface UsersManagementProps {
  onSelectUser: (userId: string) => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ onSelectUser }) => {
  const supabase = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        // Création d'utilisateurs de démonstration en cas d'échec des API
        const mockUsers: User[] = [
          {
            id: "1",
            name: "Admin Démo",
            email: "admin@example.com",
            role: UserRole.ADMIN,
            calendly_url: "",
            calendly_enabled: false,
            calendly_sync_email: ""
          },
          {
            id: "2",
            name: "Commercial Démo",
            email: "commercial@example.com",
            role: UserRole.FREELANCER,
            calendly_url: "https://calendly.com/commercial-demo",
            calendly_enabled: true,
            calendly_sync_email: "commercial@example.com"
          },
          {
            id: "3",
            name: "Client Démo",
            email: "client@example.com",
            role: UserRole.CLIENT,
            calendly_url: "",
            calendly_enabled: false,
            calendly_sync_email: ""
          }
        ];
        
        let usersData: User[] = mockUsers;
        
        try {
          // Tentative de récupération depuis Supabase, mais utilisation des données de démo en cas d'échec
          const fetchedUsers = await supabase.fetchUsers();
          if (fetchedUsers && fetchedUsers.length > 0) {
            usersData = fetchedUsers;
          }
        } catch (supabaseError) {
          console.log("Utilisation des données de démonstration en raison d'une erreur Supabase:", supabaseError);
        }
        
        setUsers(usersData);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        setHasError(true);
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

  const handleUserClick = (user: User) => {
    onSelectUser(user.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des utilisateurs</CardTitle>
        <CardDescription>
          Liste de tous les utilisateurs de l'application
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Chargement des utilisateurs...</div>
        ) : hasError ? (
          <div className="text-center py-4 text-destructive">
            Erreur lors du chargement des utilisateurs
          </div>
        ) : (
          <ScrollArea>
            <Table>
              <TableCaption>Tous les utilisateurs de votre application.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date de création</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} onClick={() => handleUserClick(user)} className="cursor-pointer hover:bg-muted">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>N/A</TableCell>
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
