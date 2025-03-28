
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ServicesHeaderProps {
  onAddNewClick: () => void;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ onAddNewClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">Services</h2>
        <p className="text-muted-foreground">
          Gérez les services proposés par votre agence.
        </p>
      </div>
      <Button onClick={onAddNewClick}>
        <Plus className="mr-2 h-4 w-4" /> Ajouter un service
      </Button>
    </div>
  );
};

export default ServicesHeader;
