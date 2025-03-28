
import React from 'react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Plus } from 'lucide-react';

interface ServicesTabListProps {
  showForm: boolean;
  isEditing: boolean;
  onAddNew: () => void;
  onCancel: () => void;
}

const ServicesTabList: React.FC<ServicesTabListProps> = ({ 
  showForm, 
  isEditing, 
  onAddNew, 
  onCancel 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-4">
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="list">Liste des services</TabsTrigger>
        {showForm && (
          <TabsTrigger value="form">
            {isEditing ? 'Modifier un service' : 'Ajouter un service'}
          </TabsTrigger>
        )}
      </TabsList>
      
      {showForm ? (
        <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Retour
        </Button>
      ) : (
        <Button variant="default" size="sm" onClick={onAddNew} className="gap-1">
          <Plus className="h-4 w-4" /> Ajouter un service
        </Button>
      )}
    </div>
  );
};

export default ServicesTabList;
