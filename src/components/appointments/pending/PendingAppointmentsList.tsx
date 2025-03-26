
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { usePendingAppointments } from "../hooks/usePendingAppointments";
import PendingAppointmentsHeader from "./PendingAppointmentsHeader";
import PendingAppointmentsTableHeader from "./PendingAppointmentsTableHeader";
import PendingAppointmentRow from "./PendingAppointmentRow";
import PendingAppointmentsLoading from "./PendingAppointmentsLoading";

const PendingAppointmentsList: React.FC = () => {
  const {
    appointments,
    contacts,
    loading,
    processingIds,
    handleAcceptAppointment,
    handleDeclineAppointment
  } = usePendingAppointments();

  if (loading) {
    return <PendingAppointmentsLoading />;
  }

  if (appointments.length === 0) {
    return null; // Ne pas afficher le composant s'il n'y a pas de rendez-vous en attente
  }

  return (
    <Card className="w-full">
      <PendingAppointmentsHeader />
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <PendingAppointmentsTableHeader />
            <TableBody>
              {appointments.map((appointment) => (
                <PendingAppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  contactName={contacts[appointment.contactId] || 'Contact inconnu'}
                  isProcessing={processingIds.includes(appointment.id)}
                  onAccept={handleAcceptAppointment}
                  onDecline={handleDeclineAppointment}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingAppointmentsList;
