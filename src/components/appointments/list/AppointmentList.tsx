
import React from "react";
import { Card } from "@/components/ui/card";
import AppointmentListHeader from "./AppointmentListHeader";
import AppointmentTable from "./AppointmentTable";
import AppointmentEmptyState from "./AppointmentEmptyState";
import AppointmentLoadingSkeleton from "./AppointmentLoadingSkeleton";
import { Appointment, normalizeAppointmentData } from "@/types/appointment";
import { useAppointments } from "@/hooks/appointments/use-appointments";

interface AppointmentListProps {
  appointments?: Appointment[];
  isLoading?: boolean;
  onStatusChange?: () => void;
  onAddAppointment?: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments: externalAppointments,
  isLoading: externalLoading,
  onStatusChange,
  onAddAppointment = () => {} // Valeur par défaut pour éviter l'erreur
}) => {
  const hookResult = useAppointments();
  
  const appointments = externalAppointments || [];
  const loading = externalLoading !== undefined ? externalLoading : hookResult.isLoading;
  
  const normalizedAppointments = React.useMemo(() => {
    return appointments?.map(app => normalizeAppointmentData(app)) || [];
  }, [appointments]);

  if (loading) {
    return <AppointmentLoadingSkeleton />;
  }

  if (normalizedAppointments.length === 0) {
    return <AppointmentEmptyState hasFilters={false} onAddAppointment={onAddAppointment} />;
  }

  const contacts = normalizedAppointments.reduce((acc, app) => {
    if (app.contactId && app.contactName) {
      acc[app.contactId] = app.contactName;
    }
    return acc;
  }, {} as Record<string, string>);

  return (
    <AppointmentTable 
      appointments={normalizedAppointments} 
      contacts={contacts} 
      onUpdate={onStatusChange || (() => {})}
    />
  );
};

export default AppointmentList;
