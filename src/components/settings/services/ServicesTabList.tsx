
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ServicesTabListProps {
  showForm: boolean;
  isEditing: boolean;
  onAddNew: () => void;
}

const ServicesTabList: React.FC<ServicesTabListProps> = ({ 
  showForm, 
  isEditing, 
  onAddNew 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <TabsList>
        <TabsTrigger value="list">Liste des services</TabsTrigger>
        {showForm && (
          <TabsTrigger value="form">
            {isEditing ? "Modifier le service" : "Ajouter un service"}
          </TabsTrigger>
        )}
      </TabsList>
      
      {!showForm && (
        <Button onClick={onAddNew} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un service
        </Button>
      )}
    </div>
  );
};

export default ServicesTabList;
