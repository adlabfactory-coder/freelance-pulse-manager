
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { User, UserRole } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface UserSelectorProps {
  currentUser: User;
  onSelectUser: (userId: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ currentUser, onSelectUser }) => {
  const supabase = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(currentUser.id);
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

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    onSelectUser(userId);
  };

  const isAdmin = currentUser.role === UserRole.ADMIN;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilisateurs</CardTitle>
        <CardDescription>
          {isAdmin 
            ? "Sélectionnez un utilisateur pour voir ou modifier son profil" 
            : "Gérer votre profil utilisateur"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAdmin ? (
          <Select 
            value={selectedUserId} 
            onValueChange={handleUserChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un utilisateur" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.role === UserRole.ADMIN ? "Admin" : user.role === UserRole.FREELANCER ? "Commercial" : "Client"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>Vous visualisez votre profil personnel</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSelector;
