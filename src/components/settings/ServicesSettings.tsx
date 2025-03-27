
import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import ServicesHeader from "./services/ServicesHeader";
import ServicesList from "./services/ServicesList";
import ServiceForm from "./services/ServiceForm";
import DeleteServiceDialog from "./services/DeleteServiceDialog";
import { useServices } from "@/hooks/useServices";
import { Service } from "@/types/service";

const ServicesSettings: React.FC = () => {
  const {
    services,
    loading,
    isSaving,
    isDeleting,
    createService,
    updateService,
    deleteService,
    loadServices
  } = useServices();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleAddClick = () => {
    setSelectedService(null);
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

  const handleSaveService = async (service: Service) => {
    if (selectedService && selectedService.id) {
      await updateService(selectedService.id, service);
    } else {
      await createService(service);
    }
    setEditDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedService && selectedService.id) {
      await deleteService(selectedService.id);
      setConfirmDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <ServicesHeader onAddService={handleAddClick} />

      <ServicesList
        services={services}
        loading={loading}
        onEditService={handleEditClick}
        onDeleteService={handleDeleteClick}
      />

      {/* Edit/Add Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        {editDialogOpen && (
          <ServiceForm
            service={selectedService}
            onSave={handleSaveService}
            onCancel={() => setEditDialogOpen(false)}
            isSaving={isSaving}
          />
        )}
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        {confirmDeleteDialogOpen && selectedService && (
          <DeleteServiceDialog
            service={selectedService}
            onConfirm={handleConfirmDelete}
            onClose={() => setConfirmDeleteDialogOpen(false)}
            isOpen={confirmDeleteDialogOpen}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ServicesSettings;
