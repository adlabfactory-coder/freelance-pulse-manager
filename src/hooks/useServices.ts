import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { Service, ServiceType } from '@/types/service'; 

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Partial<Service> | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      // Convert to the correct Service type with proper ServiceType enum values
      // and handle both is_active and isActive properties
      const typedServices = data.map(service => ({
        ...service,
        type: service.type as ServiceType,
        isActive: service.is_active, // Add isActive for components expecting that property
      })) as Service[];
      
      setServices(typedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddClick = () => {
    setSelectedService({
      name: '',
      description: '',
      price: 0,
      type: 'service',
      is_active: true
    });
    setEditDialogOpen(true);
  };

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setConfirmDeleteDialogOpen(true);
  };

  const handleServiceChange = (field: string, value: any) => {
    if (selectedService) {
      setSelectedService({ ...selectedService, [field]: value });
    }
  };

  const handleSaveService = async (service: Partial<Service>) => {
    try {
      if (service.id) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({
            name: service.name,
            description: service.description,
            price: service.price,
            type: service.type,
            is_active: service.is_active !== undefined ? service.is_active : service.isActive, // Handle both properties
            updated_at: new Date().toISOString()
          })
          .eq('id', service.id);

        if (error) throw error;
        toast.success('Service updated successfully');
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert({
            name: service.name,
            description: service.description,
            price: service.price,
            type: service.type,
            is_active: service.is_active !== undefined ? service.is_active : service.isActive, // Handle both properties
          });

        if (error) throw error;
        toast.success('Service created successfully');
      }
      
      setEditDialogOpen(false);
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
      toast.error('Failed to save service');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedService || !selectedService.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', selectedService.id);

      if (error) throw error;
      
      toast.success('Service deleted successfully');
      await fetchServices();
      setConfirmDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error('Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
    editDialogOpen,
    confirmDeleteDialogOpen,
    selectedService,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleServiceChange,
    handleSaveService,
    handleConfirmDelete,
    setEditDialogOpen,
    setConfirmDeleteDialogOpen
  };
}
