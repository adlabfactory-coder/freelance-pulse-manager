
import React from "react";
import { Card } from "@/components/ui/card";
import AppointmentListHeader from "./list/AppointmentListHeader";
import AppointmentTable from "./list/AppointmentTable";
import AppointmentEmptyState from "./list/AppointmentEmptyState";
import AppointmentLoadingSkeleton from "./list/AppointmentLoadingSkeleton";
import { Appointment } from "@/types/appointment";
import { useAppointments } from "@/hooks/use-appointments";

interface AppointmentListProps {
  searchQuery?: string;
  statusFilter?: string;
  onAddAppointment: () => void;
  appointments?: Appointment[];
  isLoading?: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  searchQuery = "", 
  statusFilter,
  onAddAppointment,
  appointments: externalAppointments,
  isLoading: externalLoading
}) => {
  // Utiliser soit les rendez-vous externes, soit charger les rendez-vous via le hook
  const hookResult = useAppointments();
  
  const appointments = externalAppointments || hookResult.appointments;
  const loading = externalLoading !== undefined ? externalLoading : hookResult.isLoading;
  
  // Filtrer les rendez-vous selon les critères de recherche
  const filteredAppointments = React.useMemo(() => {
    if (!appointments?.length) return [];
    
    let filtered = [...appointments];
    
    // Filtrage par statut si nécessaire
    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Filtrage par terme de recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.title.toLowerCase().includes(query) || 
        (app.contactName && app.contactName.toLowerCase().includes(query)) ||
        (app.description && app.description.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [appointments, searchQuery, statusFilter]);

  const hasFilters = Boolean(searchQuery || statusFilter);

  if (loading) {
    return (
      <Card className="w-full">
        <AppointmentLoadingSkeleton />
      </Card>
    );
  }

  if (filteredAppointments.length === 0) {
    return (
      <Card className="w-full">
        <AppointmentListHeader 
          appointmentCount={0} 
          hasFilters={hasFilters} 
        />
        <AppointmentEmptyState 
          hasFilters={hasFilters} 
          onAddAppointment={onAddAppointment} 
        />
      </Card>
    );
  }

  // Récupérer les contacts pour l'affichage
  const contacts = filteredAppointments.reduce((acc, app) => {
    if (app.contactId && app.contactName) {
      acc[app.contactId] = app.contactName;
    }
    return acc;
  }, {} as Record<string, string>);

  return (
    <Card className="w-full">
      <AppointmentListHeader 
        appointmentCount={filteredAppointments.length} 
        hasFilters={hasFilters} 
      />
      <AppointmentTable 
        appointments={filteredAppointments} 
        contacts={contacts} 
      />
    </Card>
  );
};

export default AppointmentList;
