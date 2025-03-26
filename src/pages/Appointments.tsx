
import React, { useState, useEffect } from "react";
import AppointmentHeader from "@/components/appointments/AppointmentHeader";
import AppointmentTabs from "@/components/appointments/AppointmentTabs";
import AddAppointmentDialog from "@/components/appointments/AddAppointmentDialog";
import { useNotifications } from "@/hooks/use-notifications";
import AppointmentList from "@/components/appointments/AppointmentList";
import PendingAppointmentsList from "@/components/appointments/PendingAppointmentsList";
import { useAuth } from "@/hooks/use-auth";

const Appointments: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"list" | "grid" | "calendar">("list");
  const [timeView, setTimeView] = useState<"day" | "week">("day");
  const [searchQuery, setSearchQuery] = useState("");
  const [openNewAppointmentDialog, setOpenNewAppointmentDialog] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { refreshNotifications } = useNotifications();
  const { isAccountManager, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "schedule">("upcoming");

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
        view={view}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddAppointment={handleAddAppointment}
      />

      <AppointmentTabs 
        date={date}
        setDate={setDate}
        timeView={timeView}
        setTimeView={setTimeView}
        onAddAppointment={handleAddAppointment}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Afficher les rendez-vous en attente d'attribution pour les chargés de compte et admins */}
      {(isAccountManager || isAdmin) && activeTab === "upcoming" && (
        <PendingAppointmentsList />
      )}

      {/* Afficher la liste des rendez-vous selon l'onglet actif */}
      {activeTab !== "schedule" && (
        <AppointmentList 
          type={activeTab} 
          onAddAppointment={handleAddAppointment}
        />
      )}

      <AddAppointmentDialog 
        open={openNewAppointmentDialog} 
        onOpenChange={setOpenNewAppointmentDialog}
        selectedDate={date}
      />
    </div>
  );
};

export default Appointments;
