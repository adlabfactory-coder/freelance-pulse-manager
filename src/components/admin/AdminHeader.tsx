
import React from 'react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onAddClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Administration</h1>
      <Button onClick={onAddClick}>Ajouter un utilisateur</Button>
    </div>
  );
};

export default AdminHeader;
