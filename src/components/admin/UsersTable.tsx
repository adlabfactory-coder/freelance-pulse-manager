
import React from 'react';
import { toast } from 'sonner';
import { User, UserRole } from '@/types';
import UserProfile from '@/components/settings/UserProfile';
import { checkSupabaseConnection } from '@/lib/supabase-client';

interface UsersTableProps {
  users: User[];
  selectedUser: User | null;
  isSupabaseConnected: boolean;
  onUserSelect: (user: User) => void;
  onDelete: (userId: string) => Promise<void>;
  onUpdateSuccess: (updatedUser: User) => Promise<void>;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  selectedUser,
  isSupabaseConnected,
  onUserSelect,
  onDelete,
  onUpdateSuccess
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Utilisateurs</h2>
        
        <ul className="space-y-2">
          {users.map(user => (
            <li 
              key={user.id}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                selectedUser?.id === user.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => onUserSelect(user)}
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
      </div>
      
      <div className="md:col-span-2">
        {selectedUser ? (
          <UserProfile 
            user={selectedUser} 
            onUpdate={async (updatedUser) => {
              try {
                await onUpdateSuccess(updatedUser);
                toast.success("Utilisateur mis à jour avec succès");
              } catch (error) {
                console.error("Erreur lors de la mise à jour:", error);
                toast.error("La mise à jour a échoué");
              }
            }}
            onDelete={async () => await onDelete(selectedUser.id)}
            canDelete={selectedUser.role !== UserRole.SUPER_ADMIN}
          />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">Sélectionnez un utilisateur ou ajoutez-en un nouveau</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
