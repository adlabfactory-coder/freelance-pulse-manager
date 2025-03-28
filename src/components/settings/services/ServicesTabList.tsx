
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServicesTabListProps {
  showForm: boolean;
  isEditing: boolean;
  onAddNew: () => void;
}

const ServicesTabList: React.FC<ServicesTabListProps> = ({ showForm, isEditing, onAddNew }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <TabsList>
        <TabsTrigger value="list">Liste des services</TabsTrigger>
        {showForm && (
          <TabsTrigger value="form">
            {isEditing ? 'Modifier un service' : 'Ajouter un service'}
          </TabsTrigger>
        )}
      </TabsList>
      
      {showForm ? (
        <Button variant="ghost" size="sm" className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Retour
        </Button>
      ) : (
        <Button variant="default" size="sm" onClick={onAddNew}>
          Ajouter un service
        </Button>
      )}
    </div>
  );
};

export default ServicesTabList;
