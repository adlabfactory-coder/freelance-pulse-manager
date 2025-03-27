
import React from "react";
import { Card } from "@/components/ui/card";
import AppointmentListHeader from "./list/AppointmentListHeader";
import AppointmentTable from "./list/AppointmentTable";
import AppointmentEmptyState from "./list/AppointmentEmptyState";
import AppointmentLoadingSkeleton from "./list/AppointmentLoadingSkeleton";
import { Appointment, normalizeFreelancerId } from "@/types/appointment";
import { useAppointments } from "@/hooks/appointments/use-appointments";

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
  const hookResult = useAppointments();
  
  const appointments = externalAppointments || hookResult.appointments;
  const loading = externalLoading !== undefined ? externalLoading : hookResult.isLoading;
  
  const normalizedAppointments = React.useMemo(() => {
    return appointments?.map(normalizeFreelancerId) || [];
  }, [appointments]);
  
  const filteredAppointments = React.useMemo(() => {
    if (!normalizedAppointments?.length) return [];
    
    let filtered = [...normalizedAppointments];
    
    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.title.toLowerCase().includes(query) || 
        (app.contactName && app.contactName.toLowerCase().includes(query)) ||
        (app.description && app.description.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [normalizedAppointments, searchQuery, statusFilter]);

  const hasFilters = Boolean(searchQuery || statusFilter);
  
  const handleRefresh = () => {
    if (hookResult.refetch) {
      hookResult.refetch();
    }
  };

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
        onUpdate={handleRefresh}
      />
    </Card>
  );
};

export default AppointmentList;
