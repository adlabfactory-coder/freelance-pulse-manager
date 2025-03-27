
import { useState, useEffect, useCallback } from 'react';
import { Service, ServiceType } from '@/types/service';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Partial<Service> | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (fetchError) {
        throw fetchError;
      }

      // Map database results to Service interface
      const mappedServices = data.map((service): Service => ({
        id: service.id,
        name: service.name,
        description: service.description || "",
        price: service.price,
        type: service.type as ServiceType,
        is_active: service.is_active,
        created_at: service.created_at,
        updated_at: service.updated_at,
      }));

      setServices(mappedServices);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
      toast.error('Impossible de charger les services');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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
    setLoading(true);
    try {
      if (service.id) {
        // Update existing service
        const { error: updateError } = await supabase
          .from('services')
          .update({
            name: service.name,
            description: service.description,
            price: service.price,
            type: service.type,
            is_active: service.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', service.id);

        if (updateError) throw updateError;
        toast.success('Service mis à jour avec succès');
      } else {
        // Create new service
        const { error: insertError } = await supabase
          .from('services')
          .insert({
            name: service.name,
            description: service.description,
            price: service.price,
            type: service.type,
            is_active: service.is_active
          });

        if (insertError) throw insertError;
        toast.success('Service créé avec succès');
      }
      
      // Refresh services list
      await fetchServices();
      setEditDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save service');
      toast.error('Erreur lors de l\'enregistrement du service');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedService || !selectedService.id) return;
    
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('services')
        .delete()
        .eq('id', selectedService.id);

      if (deleteError) throw deleteError;
      
      toast.success('Service supprimé avec succès');
      await fetchServices();
      setConfirmDeleteDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to delete service');
      toast.error('Erreur lors de la suppression du service');
    } finally {
      setLoading(false);
    }
  };

  const refetch = fetchServices;

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
