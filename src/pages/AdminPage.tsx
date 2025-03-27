
import React from 'react';
import { useAdminUsers } from '@/hooks/admin/useAdminUsers';
import AdminHeader from '@/components/admin/AdminHeader';
import ConnectionNotice from '@/components/admin/ConnectionNotice';
import UsersTable from '@/components/admin/UsersTable';
import AddUserForm from '@/components/admin/UserForm';

const AdminPage: React.FC = () => {
  const {
    users,
    loading,
    selectedUser,
    showAddForm,
    isSupabaseConnected,
    handleUserSelect,
    handleAddClick,
    handleAddSuccess,
    handleUpdateSuccess,
    handleDelete,
    setShowAddForm
  } = useAdminUsers();

  return (
    <div className="container mx-auto py-8">
      <AdminHeader onAddClick={handleAddClick} />
      
      <ConnectionNotice isSupabaseConnected={isSupabaseConnected} />
      
      {showAddForm ? (
        <AddUserForm 
          onSuccess={handleAddSuccess} 
          onCancel={() => setShowAddForm(false)} 
        />
      ) : (
        <UsersTable
          users={users}
          selectedUser={selectedUser}
          isSupabaseConnected={isSupabaseConnected}
          onUserSelect={handleUserSelect}
          onDelete={handleDelete}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default AdminPage;
