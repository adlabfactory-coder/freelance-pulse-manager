
import { useState, useCallback } from 'react';
import { Service } from '@/types/service';
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
        .order('name', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setServices(data);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Une erreur est survenue lors du chargement des services');
    } finally {
      setLoading(false);
    }
  }, []);

  const addService = useCallback(async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setServices(prev => [...prev, data]);
      return { success: true, id: data.id };
    } catch (err) {
      console.error('Error adding service:', err);
      setError('Une erreur est survenue lors de l\'ajout du service');
      return { success: false };
    }
  }, []);

  const editService = useCallback(async (id: string, service: Partial<Service>) => {
    setError('');
    
    try {
      const { error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setServices(prev => 
        prev.map(item => item.id === id ? { ...item, ...service } : item)
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error updating service:', err);
      setError('Une erreur est survenue lors de la mise à jour du service');
      return { success: false };
    }
  }, []);

  const removeService = useCallback(async (id: string) => {
    setError('');
    
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
    } catch (err) {
      console.error('Error removing service:', err);
      setError('Une erreur est survenue lors de la suppression du service');
      return { success: false };
    }
  }, []);

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
