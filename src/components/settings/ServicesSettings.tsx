import React from "react";
import { Dialog } from "@/components/ui/dialog";
import ServicesHeader from "./services/ServicesHeader";
import ServicesList from "./services/ServicesList";
import ServiceForm from "./services/ServiceForm";
import DeleteServiceDialog from "./services/DeleteServiceDialog";
import { useServices } from "./services/hooks/useServices";

const ServicesSettings: React.FC = () => {
  const {
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
  } = useServices();

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
        <ServiceForm
          service={selectedService}
          onSave={handleSaveService}
          onCancel={() => setEditDialogOpen(false)}
          onChange={handleServiceChange}
        />
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DeleteServiceDialog
          service={selectedService as any}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDeleteDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default ServicesSettings;
