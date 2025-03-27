
import { useState, useEffect, useCallback } from "react";
import { Service, ServiceType } from "@/types/service";
import { toast } from "@/components/ui/use-toast";
import { fetchServices, createService, updateService, deleteService } from "@/services/services-service";

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors du chargement des services");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les services. Veuillez réessayer."
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleCreateService = useCallback(async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSaving(true);
    try {
      const result = await createService(serviceData);
      if (result.success) {
        toast({
          title: "Service créé",
          description: "Le service a été créé avec succès."
        });
        await loadServices(); // Recharger la liste
        return true;
      } else {
        throw new Error("Impossible de créer le service");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la création du service"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [loadServices]);

  const handleUpdateService = useCallback(async (id: string, serviceData: Partial<Service>) => {
    setIsSaving(true);
    try {
      const success = await updateService(id, serviceData);
      if (success) {
        toast({
          title: "Service mis à jour",
          description: "Le service a été mis à jour avec succès."
        });
        await loadServices(); // Recharger la liste
        return true;
      } else {
        throw new Error("Impossible de mettre à jour le service");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la mise à jour du service"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [loadServices]);

  const handleDeleteService = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      const success = await deleteService(id);
      if (success) {
        toast({
          title: "Service supprimé",
          description: "Le service a été supprimé avec succès."
        });
        await loadServices(); // Recharger la liste
        return true;
      } else {
        throw new Error("Impossible de supprimer le service");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la suppression du service"
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [loadServices]);

  return {
    services,
    loading,
    error,
    isSaving,
    isDeleting,
    loadServices,
    createService: handleCreateService,
    updateService: handleUpdateService,
    deleteService: handleDeleteService
  };
};
