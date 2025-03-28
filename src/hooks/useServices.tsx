
import { useState, useEffect, useCallback } from 'react';
import { Service, ServiceType } from '@/types/service';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        setServices(data as Service[]);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des services:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des services');
      toast.error('Impossible de charger les services. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = useCallback(async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSaving(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          name: service.name,
          description: service.description,
          price: service.price,
          type: service.type,
          is_active: service.is_active
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setServices(prev => [...prev, data[0] as Service]);
        return { success: true, id: data[0].id };
      }

      return { success: false };
    } catch (err: any) {
      console.error('Erreur lors de la création du service:', err);
      setError(err.message || 'Une erreur est survenue lors de la création du service');
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateService = useCallback(async (id: string, serviceUpdates: Partial<Service>) => {
    setIsSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('services')
        .update({
          name: serviceUpdates.name,
          description: serviceUpdates.description,
          price: serviceUpdates.price,
          type: serviceUpdates.type,
          is_active: serviceUpdates.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setServices(prev => 
        prev.map(service => service.id === id ? { ...service, ...serviceUpdates } : service)
      );

      return { success: true };
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du service:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour du service');
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteService = useCallback(async (id: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setServices(prev => prev.filter(service => service.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error('Erreur lors de la suppression du service:', err);
      setError(err.message || 'Une erreur est survenue lors de la suppression du service');
      return { success: false, error: err.message };
    } finally {
      setIsDeleting(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
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

export default useServices;
