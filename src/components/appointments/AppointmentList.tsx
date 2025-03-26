
import React from "react";
import { Card } from "@/components/ui/card";
import { useAppointmentList } from "./hooks/useAppointmentList";
import AppointmentListHeader from "./list/AppointmentListHeader";
import AppointmentTable from "./list/AppointmentTable";
import AppointmentEmptyState from "./list/AppointmentEmptyState";
import AppointmentLoadingSkeleton from "./list/AppointmentLoadingSkeleton";

interface AppointmentListProps {
  searchQuery?: string;
  statusFilter?: string;
  onAddAppointment: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  searchQuery = "", 
  statusFilter,
  onAddAppointment 
}) => {
  const { filteredAppointments, loading, contacts } = useAppointmentList({
    searchQuery,
    statusFilter
  });

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
