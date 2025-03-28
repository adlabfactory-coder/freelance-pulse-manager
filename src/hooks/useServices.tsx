
import { useState, useEffect, useCallback } from 'react';
import { Service, DEFAULT_SERVICES } from '@/types/service';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/components/ui/use-toast';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer les services depuis la base de données
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setServices(data as Service[]);
      } else {
        // Si aucun service n'est trouvé, nous pouvons initialiser avec les services par défaut
        console.log('Aucun service trouvé, initialisation avec les services par défaut');
        await initializeDefaultServices();
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des services:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des services');
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les services. Veuillez réessayer plus tard.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const initializeDefaultServices = async () => {
    try {
      // Insérer les services par défaut dans la base de données
      const { data, error } = await supabase
        .from('services')
        .insert(DEFAULT_SERVICES)
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setServices(data as Service[]);
      }
    } catch (err: any) {
      console.error('Erreur lors de l\'initialisation des services par défaut:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'initialisation des services');
      // Nous utilisons quand même les services par défaut même si l'insertion a échoué
      setServices(DEFAULT_SERVICES as Service[]);
    }
  };

  const createService = useCallback(async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
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
        toast({
          title: 'Succès',
          description: 'Le service a été créé avec succès.'
        });
        return { success: true, service: data[0] as Service };
      }

      return { success: false };
    } catch (err: any) {
      console.error('Erreur lors de la création du service:', err);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: err.message || 'Une erreur est survenue lors de la création du service'
      });
      return { success: false, error: err.message };
    }
  }, []);

  const updateService = useCallback(async (id: string, serviceUpdates: Partial<Service>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({
          name: serviceUpdates.name,
          description: serviceUpdates.description,
          price: serviceUpdates.price,
          type: serviceUpdates.type,
          is_active: serviceUpdates.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setServices(prev => 
          prev.map(service => service.id === id ? { ...service, ...data[0] } : service)
        );
        toast({
          title: 'Succès',
          description: 'Le service a été mis à jour avec succès.'
        });
        return { success: true, service: data[0] as Service };
      }

      return { success: false };
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du service:', err);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: err.message || 'Une erreur est survenue lors de la mise à jour du service'
      });
      return { success: false, error: err.message };
    }
  }, []);

  const deleteService = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setServices(prev => prev.filter(service => service.id !== id));
      toast({
        title: 'Succès',
        description: 'Le service a été supprimé avec succès.'
      });
      return { success: true };
    } catch (err: any) {
      console.error('Erreur lors de la suppression du service:', err);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: err.message || 'Une erreur est survenue lors de la suppression du service'
      });
      return { success: false, error: err.message };
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
    createService,
    updateService,
    deleteService
  };
};

export default useServices;
