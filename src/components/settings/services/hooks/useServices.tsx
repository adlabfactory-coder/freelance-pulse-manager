
import { useState, useEffect } from "react";
import { Service, ServiceType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchServices, 
  createService, 
  updateService, 
  deleteService 
} from "@/services/services-service";

export const useServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Partial<Service> | null>(null);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les services. Veuillez réessayer plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleAddClick = () => {
    setSelectedService({
      name: "",
      description: "",
      type: ServiceType.SERVICE,
      price: 0,
      isActive: true,
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
    setSelectedService((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveService = async () => {
    if (!selectedService || !selectedService.name || selectedService.price === undefined) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    try {
      if (selectedService.id) {
        // Update existing service - pass id and service separately
        const result = await updateService(selectedService.id, selectedService as Service);
        toast({
          title: "Service mis à jour",
          description: `Le service "${selectedService.name}" a été mis à jour avec succès.`,
        });
      } else {
        // Create new service - pass only one argument as expected by the function
        const result = await createService({
          name: selectedService.name,
          description: selectedService.description,
          type: selectedService.type || ServiceType.SERVICE,
          price: selectedService.price,
          isActive: selectedService.isActive !== false
        });
        toast({
          title: "Service créé",
          description: `Le service "${selectedService.name}" a été créé avec succès.`,
        });
      }
      
      setEditDialogOpen(false);
      loadServices();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du service:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du service.",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedService || !selectedService.id) return;

    try {
      const result = await deleteService(selectedService.id);
      toast({
        title: "Service supprimé",
        description: `Le service "${selectedService.name}" a été supprimé avec succès.`,
      });
      setConfirmDeleteDialogOpen(false);
      loadServices();
    } catch (error) {
      console.error("Erreur lors de la suppression du service:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du service.",
      });
    }
  };

  return {
    services,
    loading,
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
};
