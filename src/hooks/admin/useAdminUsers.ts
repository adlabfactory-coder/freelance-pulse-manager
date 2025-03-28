
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User } from '@/types';
import { useUserOperations } from '@/hooks/supabase/user-operations';
import { checkSupabaseConnection } from '@/lib/supabase-client';
import { OperationResult } from '@/hooks/supabase';

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
        setUsers(userOperations.getMockUsers());
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error("Impossible de charger les utilisateurs.");
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

  const handleUpdateSuccess = async (updatedUser: User): Promise<void> => {
    try {
      // Mettre à jour l'utilisateur avec le hook useUserOperations
      const result = await userOperations.updateUser({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        supervisor_id: updatedUser.supervisor_id
      });
      
      if (result.success) {
        // Mise à jour de la liste des utilisateurs
        setUsers(prev => prev.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        ));
        
        // Mise à jour de l'utilisateur sélectionné
        if (selectedUser && selectedUser.id === updatedUser.id) {
          setSelectedUser(updatedUser);
        }
        
        toast.success("Utilisateur mis à jour avec succès");
        return Promise.resolve();
      } else {
        throw new Error(result.error || "La mise à jour a échoué");
      }
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      toast.error("Une erreur est survenue lors de la mise à jour");
      return Promise.reject(error);
    }
  };

  const handleUpdateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!userData.id) return false;
    
    try {
      const result = await userOperations.updateUser(userData);
      
      if (result.success) {
        setUsers(prev => prev.map(user => 
          user.id === userData.id ? { ...user, ...userData } : user
        ));
        
        if (selectedUser && selectedUser.id === userData.id) {
          setSelectedUser(prev => prev ? { ...prev, ...userData } : null);
        }
        
        toast.success("Utilisateur mis à jour");
        
        return true;
      }
      
      toast.error("Impossible de mettre à jour l'utilisateur.");
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Une erreur est survenue lors de la mise à jour de l'utilisateur.");
      return false;
    }
  };

  const handleDelete = async (userId: string): Promise<void> => {
    if (!userId) return Promise.resolve();
    
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Il sera définitivement supprimé après 48 heures.")) {
      return Promise.resolve();
    }
    
    try {
      const result: OperationResult = await userOperations.deleteUser(userId);
      
      if (result.success) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(null);
        }
        
        toast.success("Utilisateur supprimé (sera définitivement supprimé après 48 heures)");
      } else {
        toast.error("Impossible de supprimer l'utilisateur.");
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Une erreur est survenue lors de la suppression de l'utilisateur.");
      return Promise.reject(error);
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
