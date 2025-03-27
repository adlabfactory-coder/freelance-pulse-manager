
import { useState, useEffect, useCallback } from "react";
import { Service, ServiceType } from "@/types/service";
import { useToast } from "@/hooks/use-toast";
import { fetchServices, createService, updateService, deleteService } from "@/services/services-service";

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getServices = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedServices = await fetchServices();
      setServices(fetchedServices);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des services");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les services"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    getServices();
  }, [getServices]);

  const addService = useCallback(async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const result = await createService(service);
      if (result.success) {
        toast({
          title: "Succès",
          description: "Service ajouté avec succès"
        });
        await getServices();
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter le service"
        });
        return false;
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Une erreur est survenue"
      });
      return false;
    }
  }, [getServices, toast]);

  const editService = useCallback(async (id: string, service: Partial<Service>) => {
    try {
      const success = await updateService(id, service);
      if (success) {
        toast({
          title: "Succès",
          description: "Service mis à jour avec succès"
        });
        await getServices();
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour le service"
        });
        return false;
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Une erreur est survenue"
      });
      return false;
    }
  }, [getServices, toast]);

  const removeService = useCallback(async (id: string) => {
    try {
      const success = await deleteService(id);
      if (success) {
        toast({
          title: "Succès",
          description: "Service supprimé avec succès"
        });
        await getServices();
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer le service"
        });
        return false;
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Une erreur est survenue"
      });
      return false;
    }
  }, [getServices, toast]);

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
