
import { useState, useEffect, useCallback } from 'react';
import { Service, ServiceType, ServiceCategory } from '@/types/service';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setServices(data || []);
    } catch (err: any) {
      console.error('Error loading services:', err);
      setError(err.message);
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  }, []);

  const addService = useCallback(async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();
      
      if (error) throw error;
      
      setServices(prev => [...prev, data]);
      toast.success('Service ajouté avec succès');
      return data;
    } catch (err: any) {
      console.error('Error adding service:', err);
      toast.error('Erreur lors de l\'ajout du service');
      throw err;
    }
  }, []);

  const editService = useCallback(async (id: string, service: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setServices(prev => prev.map(s => s.id === id ? data : s));
      toast.success('Service mis à jour avec succès');
      return data;
    } catch (err: any) {
      console.error('Error updating service:', err);
      toast.error('Erreur lors de la mise à jour du service');
      throw err;
    }
  }, []);

  const removeService = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success('Service supprimé avec succès');
      return true;
    } catch (err: any) {
      console.error('Error removing service:', err);
      toast.error('Erreur lors de la suppression du service');
      throw err;
    }
  }, []);

  useEffect(() => {
    getServices();
  }, [getServices]);

  return {
    services,
    loading,
    error,
    getServices,
    addService,
    editService,
    removeService
  };
};
