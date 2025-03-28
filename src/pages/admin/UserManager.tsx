
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsersTable from '@/components/admin/UsersTable';
import { UserProfileTemplates } from '@/components/admin/UserProfileTemplates';
import { useAdminUsers } from '@/hooks/admin/useAdminUsers';
import { UserRole } from '@/types';

const UserManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('templates');
  const {
    users,
    loading,
    selectedUser,
    isSupabaseConnected,
    handleUserSelect,
    handleAddSuccess,
    handleUpdateSuccess,
    handleDelete
  } = useAdminUsers();

  // Add a handler for template selection
  const handleSelectTemplate = (role: UserRole) => {
    console.log(`Template selected: ${role}`);
    // Here you would typically create a new user with the selected role template
    // For now, we're just logging it
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Modèles d'utilisateurs</TabsTrigger>
          <TabsTrigger value="users">Liste des utilisateurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="mt-6">
          <UserProfileTemplates onSelectTemplate={handleSelectTemplate} />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <UsersTable
            users={users}
            selectedUser={selectedUser}
            isSupabaseConnected={isSupabaseConnected}
            onUserSelect={handleUserSelect}
            onDelete={handleDelete}
            onUpdateSuccess={handleUpdateSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManager;
