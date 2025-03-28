
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabase } from "@/hooks/use-supabase";
import { User } from "@/types";

interface UserSelectorProps {
  onUserSelect: (userId: string) => void;
  preselectedUserId?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  onUserSelect,
  preselectedUserId,
  label = "Utilisateur",
  placeholder = "Sélectionner un utilisateur",
  disabled = false,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useSupabase();

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const usersList = await supabase.fetchUsers();
        setUsers(usersList as User[]);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [supabase]);

  // If a preselected user is provided but not in the list, fetch it
  useEffect(() => {
    const fetchPreselectedUser = async () => {
      if (preselectedUserId && !users.some(u => u.id === preselectedUserId)) {
        try {
          const user = await supabase.fetchUserById(preselectedUserId);
          if (user) {
            setUsers(prev => [...prev, user as User]);
          }
        } catch (error) {
          console.error("Erreur lors du chargement de l'utilisateur présélectionné:", error);
        }
      }
    };

    if (preselectedUserId && users.length > 0) {
      fetchPreselectedUser();
    }
  }, [preselectedUserId, users, supabase]);

  const handleChange = (value: string) => {
    onUserSelect(value);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium leading-none">{label}</label>}
      <Select
        disabled={disabled || isLoading}
        value={preselectedUserId}
        onValueChange={handleChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "Chargement..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name} ({user.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserSelector;
