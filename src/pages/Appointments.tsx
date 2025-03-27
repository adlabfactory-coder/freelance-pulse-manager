
import React, { useState, useEffect } from "react";
import AppointmentHeader from "@/components/appointments/AppointmentHeader";
import AddAppointmentDialog from "@/components/appointments/AddAppointmentDialog";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuth } from "@/hooks/use-auth";
import AppointmentFilter from "@/components/appointments/components/AppointmentFilter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentList from "@/components/appointments/AppointmentList";
import PendingAppointmentsList from "@/components/appointments/PendingAppointmentsList";
import { filterUpcomingAppointments, filterPastAppointments } from "@/services/appointments/filter";
import { useAppointments } from "@/hooks/use-appointments";

const Appointments: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openNewAppointmentDialog, setOpenNewAppointmentDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const { refreshNotifications } = useNotifications();
  const { isAccountManager, isAdmin } = useAuth();
  const { appointments, isLoading, refresh } = useAppointments();

  const handleAddAppointment = () => {
    setOpenNewAppointmentDialog(true);
  };

  // Écouter l'événement de création de rendez-vous pour rafraîchir les notifications
  useEffect(() => {
    const handleAppointmentCreated = () => {
      console.log("Événement de création de rendez-vous détecté, rafraîchissement des données");
      refreshNotifications();
      refresh(); // Rafraîchir la liste des rendez-vous
    };

    window.addEventListener('appointment-created', handleAppointmentCreated);

    return () => {
      window.removeEventListener('appointment-created', handleAppointmentCreated);
    };
  }, [refreshNotifications, refresh]);

  // Filtrer les rendez-vous en fonction de l'onglet actif
  const filteredAppointments = activeTab === "upcoming" 
    ? filterUpcomingAppointments(appointments)
    : filterPastAppointments(appointments);

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

      {/* Onglets pour les rendez-vous à venir et passés */}
      <Tabs 
        defaultValue="upcoming" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "upcoming" | "past")}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Rendez-vous à venir</TabsTrigger>
          <TabsTrigger value="past">Rendez-vous passés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <AppointmentList 
            appointments={filteredAppointments}
            isLoading={isLoading}
            searchQuery={searchQuery}
            statusFilter={statusFilter !== "all" ? statusFilter : undefined}
            onAddAppointment={handleAddAppointment}
          />
        </TabsContent>
        
        <TabsContent value="past">
          <AppointmentList 
            appointments={filteredAppointments}
            isLoading={isLoading}
            searchQuery={searchQuery}
            statusFilter={statusFilter !== "all" ? statusFilter : undefined}
            onAddAppointment={handleAddAppointment}
          />
        </TabsContent>
      </Tabs>

      <AddAppointmentDialog 
        open={openNewAppointmentDialog} 
        onOpenChange={setOpenNewAppointmentDialog}
        selectedDate={date}
      />
    </div>
  );
};

export default Appointments;
