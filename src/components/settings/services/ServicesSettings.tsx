
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Service, ServiceType } from '@/types/service';
import { useServices } from '@/hooks/useServices';
import ServicesList from './ServicesList';
import ServicesHeader from './ServicesHeader';
import ServiceFormView from './ServiceFormView';
import ServicesTabList from './ServicesTabList';

const ServicesSettings: React.FC = () => {
  const {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    loadServices
  } = useServices();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleAddNewClick = () => {
    setEditingService(null);
    setShowAddForm(true);
    setActiveTab('form');
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowAddForm(false);
    setActiveTab('form');
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingService(null);
    setActiveTab('list');
  };

  const handleSaveService = async (service: Service) => {
    try {
      setIsSaving(true);
      if (service.id) {
        // Mise à jour d'un service existant
        await updateService(service.id, service);
        toast.success(`Service "${service.name}" mis à jour avec succès`);
      } else {
        // Création d'un nouveau service
        await createService(service);
        toast.success(`Service "${service.name}" créé avec succès`);
      }
      
      setShowAddForm(false);
      setEditingService(null);
      setActiveTab('list');
      await loadServices(); // Recharger la liste des services
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du service:', error);
      toast.error(`Erreur lors de l'enregistrement du service: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (service: Service) => {
    try {
      await deleteService(service.id);
      toast.success(`Service "${service.name}" supprimé avec succès`);
      await loadServices(); // Recharger la liste des services
    } catch (error) {
      console.error('Erreur lors de la suppression du service:', error);
      toast.error(`Erreur lors de la suppression du service: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const emptyService: Service = {
    id: '',
    name: '',
    type: ServiceType.OTHER, // Fix: Use a proper enum value from ServiceType instead of the string "service"
    price: 0,
    description: '',
    is_active: true
  };

  return (
    <Card className="p-6">
      <ServicesHeader onAddNewClick={handleAddNewClick} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ServicesTabList 
          showForm={showAddForm || !!editingService}
          isEditing={!!editingService}
          onAddNew={handleAddNewClick}
          onCancel={handleCancelForm}
        />

        <TabsContent value="list" className="pt-4">
          <ServicesList 
            services={services}
            loading={loading}
            onEditService={handleEditService}
            onDeleteService={handleDeleteService}
          />
        </TabsContent>

        <TabsContent value="form" className="pt-4">
          <ServiceFormView 
            service={editingService || emptyService}
            onSave={handleSaveService}
            onCancel={handleCancelForm}
            isSaving={isSaving}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ServicesSettings;
