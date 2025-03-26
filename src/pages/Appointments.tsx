
import React, { useState, useEffect } from "react";
import AppointmentHeader from "@/components/appointments/AppointmentHeader";
import AddAppointmentDialog from "@/components/appointments/AddAppointmentDialog";
import { useNotifications } from "@/hooks/use-notifications";
import AppointmentList from "@/components/appointments/AppointmentList";
import PendingAppointmentsList from "@/components/appointments/PendingAppointmentsList";
import { useAuth } from "@/hooks/use-auth";
import AppointmentFilter from "@/components/appointments/components/AppointmentFilter";

const Appointments: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openNewAppointmentDialog, setOpenNewAppointmentDialog] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { refreshNotifications } = useNotifications();
  const { isAccountManager, isAdmin } = useAuth();

  const handleAddAppointment = () => {
    setOpenNewAppointmentDialog(true);
  };

  // Limite à un seul chargement
  useEffect(() => {
    if (!dataLoaded) {
      console.log("Chargement initial des rendez-vous");
      // Ici, vous pouvez ajouter des chargements de données si nécessaire
      setDataLoaded(true);
    }
  }, [dataLoaded]);

  // Écouter l'événement de création de rendez-vous pour rafraîchir les notifications
  useEffect(() => {
    const handleAppointmentCreated = () => {
      console.log("Événement de création de rendez-vous détecté, rafraîchissement des notifications");
      refreshNotifications();
    };

    window.addEventListener('appointment-created', handleAppointmentCreated);

    return () => {
      window.removeEventListener('appointment-created', handleAppointmentCreated);
    };
  }, [refreshNotifications]);

  return (
    <div className="space-y-6">
      <AppointmentHeader 
        onAddAppointment={handleAddAppointment}
      />

      <AppointmentFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Afficher les rendez-vous en attente d'attribution pour les chargés de compte et admins */}
      {(isAccountManager || isAdmin) && (
        <PendingAppointmentsList />
      )}

      {/* Afficher la liste des rendez-vous */}
      <AppointmentList 
        searchQuery={searchQuery}
        statusFilter={statusFilter !== "all" ? statusFilter : undefined}
        onAddAppointment={handleAddAppointment}
      />

      <AddAppointmentDialog 
        open={openNewAppointmentDialog} 
        onOpenChange={setOpenNewAppointmentDialog}
        selectedDate={date}
      />
    </div>
  );
};

export default Appointments;
