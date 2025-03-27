
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User } from '@/types';
import { useUserOperations } from '@/hooks/supabase/use-user-operations';
import { checkSupabaseConnection } from '@/lib/supabase-client';

export const useAdminUsers = () => {
  const userOperations = useUserOperations();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkSupabaseConnection();
        setIsSupabaseConnected(connected);
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setIsSupabaseConnected(false);
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [isSupabaseConnected]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      if (isSupabaseConnected) {
        const fetchedUsers = await userOperations.fetchUsers();
        setUsers(fetchedUsers);
      } else {
        // Fall back to mock data if Supabase is not connected
        setUsers(userOperations.getMockUsers());
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast("Impossible de charger les utilisateurs.");
      
      // Fall back to mock data in case of error
      setUsers(userOperations.getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowAddForm(false);
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setShowAddForm(true);
  };

  const handleAddSuccess = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    setShowAddForm(false);
    setSelectedUser(newUser);
  };

  const handleUpdateSuccess = (updatedUser: User) => {
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    setSelectedUser(updatedUser);
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!userData.id) return false;
    
    try {
      const result = await userOperations.updateUser(userData);
      
      if (result) {
        // Update the user in the local state
        setUsers(prev => prev.map(user => 
          user.id === userData.id ? { ...user, ...userData } : user
        ));
        
        if (selectedUser && selectedUser.id === userData.id) {
          setSelectedUser(prev => prev ? { ...prev, ...userData } : null);
        }
        
        toast("Utilisateur mis à jour");
        
        return true;
      }
      
      toast("Impossible de mettre à jour l'utilisateur.");
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      toast("Une erreur est survenue lors de la mise à jour de l'utilisateur.");
      return false;
    }
  };

  const handleDelete = async (userId: string) => {
    if (!userId) return;
    
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }
    
    try {
      const success = await userOperations.deleteUser(userId);
      
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(null);
        }
        
        toast("Utilisateur supprimé");
      } else {
        toast("Impossible de supprimer l'utilisateur.");
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast("Une erreur est survenue lors de la suppression de l'utilisateur.");
    }
  };

  return {
    users,
    loading,
    selectedUser,
    showAddForm,
    isSupabaseConnected,
    handleUserSelect,
    handleAddClick,
    handleAddSuccess,
    handleUpdateSuccess,
    handleUpdateUser,
    handleDelete,
    setShowAddForm,
  };
};
