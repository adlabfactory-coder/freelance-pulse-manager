import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, UserRole } from '@/types';
import { useUserOperations } from '@/hooks/supabase/use-user-operations';
import UserForm from '@/components/settings/UserForm';
import UserProfile from '@/components/settings/UserProfile';
import { checkSupabaseConnection } from '@/lib/supabase-client';

const AdminPage: React.FC = () => {
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
        toast("Impossible de charger les utilisateurs.", {
          description: "Une erreur est survenue lors du chargement des utilisateurs.",
          variant: "destructive"
        });
        
        // Fall back to mock data in case of error
        setUsers(userOperations.getMockUsers());
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [userOperations, isSupabaseConnected]);

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
        
        toast({
          title: "Utilisateur mis à jour",
          description: "Les modifications ont été enregistrées avec succès."
        });
        
        return true;
      }
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'utilisateur."
      });
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'utilisateur."
      });
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
        
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été supprimé avec succès."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur."
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur."
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administration</h1>
        <Button onClick={handleAddClick}>Ajouter un utilisateur</Button>
      </div>
      
      {!isSupabaseConnected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-medium text-yellow-800">Mode démo</p>
          <p className="text-yellow-700">La connexion à Supabase n'est pas configurée. Les données affichées sont fictives.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Utilisateurs</h2>
          
          {loading ? (
            <p className="text-gray-500">Chargement des utilisateurs...</p>
          ) : (
            <ul className="space-y-2">
              {users.map(user => (
                <li 
                  key={user.id}
                  className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    selectedUser?.id === user.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className="inline-block px-2 py-1 text-xs rounded bg-gray-200 text-gray-800 mt-1">
                    {user.role}
                  </span>
                </li>
              ))}
              
              {users.length === 0 && (
                <p className="text-gray-500">Aucun utilisateur trouvé</p>
              )}
            </ul>
          )}
        </div>
        
        <div className="md:col-span-2">
          {showAddForm ? (
            <UserForm onSuccess={handleAddSuccess} onCancel={() => setShowAddForm(false)} />
          ) : selectedUser ? (
            <UserProfile 
              user={selectedUser} 
              onUpdate={handleUpdateSuccess}
              onDelete={() => handleDelete(selectedUser.id)}
              canDelete={selectedUser.role !== UserRole.SUPER_ADMIN}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">Sélectionnez un utilisateur ou ajoutez-en un nouveau</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
