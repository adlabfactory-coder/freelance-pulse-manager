
import { useState, useEffect, useCallback } from 'react';
import { Service } from '@/types/service';
import { fetchServices, createService as apiCreateService, updateService as apiUpdateService, deleteService as apiDeleteService } from '@/services/services-service';
import { toast } from 'sonner';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Impossible de charger les services');
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const createService = useCallback(async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await apiCreateService(service);
      if (result.success) {
        toast.success('Service créé avec succès');
        await loadServices();
        return { success: true, id: result.id };
      } else {
        throw new Error('Échec de la création du service');
      }
    } catch (err) {
      console.error('Error creating service:', err);
      setError('Impossible de créer le service');
      toast.error('Erreur lors de la création du service');
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  }, [loadServices]);

  const updateService = useCallback(async (id: string, service: Partial<Service>) => {
    setIsSaving(true);
    setError(null);
    try {
      const success = await apiUpdateService(id, service);
      if (success) {
        toast.success('Service mis à jour avec succès');
        await loadServices();
        return true;
      } else {
        throw new Error('Échec de la mise à jour du service');
      }
    } catch (err) {
      console.error('Error updating service:', err);
      setError('Impossible de mettre à jour le service');
      toast.error('Erreur lors de la mise à jour du service');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [loadServices]);

  const deleteService = useCallback(async (id: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      const success = await apiDeleteService(id);
      if (success) {
        toast.success('Service supprimé avec succès');
        await loadServices();
        return true;
      } else {
        throw new Error('Échec de la suppression du service');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Impossible de supprimer le service');
      toast.error('Erreur lors de la suppression du service');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [loadServices]);

  return {
    services,
    loading,
    isSaving,
    isDeleting,
    error,
    loadServices,
    createService,
    updateService,
    deleteService
  };
};
