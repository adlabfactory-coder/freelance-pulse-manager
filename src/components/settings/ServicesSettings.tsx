
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Service, ServiceType } from '@/types/service';
import { useServices } from '@/hooks/useServices';
import ServicesTabList from './services/ServicesTabList';
import ServicesListView from './services/ServicesListView';
import ServiceFormView from './services/ServiceFormView';

const ServicesSettings: React.FC = () => {
  const { 
    services, 
    loading, 
    createService, 
    updateService, 
    deleteService 
  } = useServices();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState('list');

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
      if (service.id) {
        await updateService(service.id, service);
      } else {
        await createService(service);
      }
      setShowAddForm(false);
      setEditingService(null);
      setActiveTab('list');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteService = async (service: Service) => {
    try {
      await deleteService(service.id);
    } catch (error) {
      console.error(error);
    }
  };

  const emptyService: Service = {
    id: '',
    name: '',
    type: 'service' as ServiceType,
    price: 0,
    description: '',
    is_active: true
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <ServicesTabList 
        showForm={showAddForm || !!editingService}
        isEditing={!!editingService}
        onAddNew={handleAddNewClick}
      />

      <TabsContent value="list">
        <ServicesListView 
          services={services}
          loading={loading}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
        />
      </TabsContent>

      <TabsContent value="form">
        <ServiceFormView 
          service={editingService || emptyService}
          onSave={handleSaveService}
          onCancel={handleCancelForm}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ServicesSettings;
