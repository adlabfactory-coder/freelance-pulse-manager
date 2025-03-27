import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Service } from '@/types/service';
import ServicesList from './services/ServicesList';
import ServiceForm from './services/ServiceForm';
import { useServices } from './services/hooks/useServices';
import { toast } from 'sonner';

const ServicesSettings: React.FC = () => {
  const { services, loading, error, getServices, addService, editService, removeService } = useServices();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveService = async (service: Service) => {
    setIsSaving(true);
    try {
      if (service.id) {
        await editService(service);
        toast.success("Service mis à jour avec succès");
      } else {
        await addService(service);
        toast.success("Service ajouté avec succès");
      }
      setShowAddForm(false);
      setEditingService(null);
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement du service");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (service: Service) => {
    try {
      await removeService(service.id);
      toast.success("Service supprimé avec succès");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression du service");
      console.error(error);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowAddForm(false);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingService(null);
  };

  const handleAddNewClick = () => {
    setEditingService(null);
    setShowAddForm(true);
  };

  const emptyService: Service = {
    id: '',
    name: '',
    type: '',
    price: 0,
    description: '',
    is_active: true
  };

  return (
    <Tabs defaultValue="list" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="list">Liste des services</TabsTrigger>
          {(showAddForm || editingService) && (
            <TabsTrigger value="form">
              {editingService ? "Modifier le service" : "Ajouter un service"}
            </TabsTrigger>
          )}
        </TabsList>
        
        {!showAddForm && !editingService && (
          <Button onClick={handleAddNewClick} className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un service
          </Button>
        )}
      </div>

      <TabsContent value="list">
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ServicesList 
              services={services} 
              loading={loading} 
              onEditService={handleEditService}
              onDeleteService={handleDeleteService}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="form">
        <Card>
          <CardHeader>
            <CardTitle>
              {editingService ? "Modifier le service" : "Ajouter un service"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceForm 
              service={editingService || emptyService} 
              onSave={handleSaveService} 
              onCancel={handleCancelForm}
              isSaving={isSaving}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ServicesSettings;
