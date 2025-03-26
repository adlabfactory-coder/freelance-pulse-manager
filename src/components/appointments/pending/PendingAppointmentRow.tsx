
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Appointment } from "@/types/appointment";
import PendingAppointmentActions from "./PendingAppointmentActions";

interface PendingAppointmentRowProps {
  appointment: Appointment;
  contactName: string;
  isProcessing: boolean;
  onAccept: (appointmentId: string, contactId: string) => void;
  onDecline: (appointmentId: string) => void;
}

const PendingAppointmentRow: React.FC<PendingAppointmentRowProps> = ({
  appointment,
  contactName,
  isProcessing,
  onAccept,
  onDecline
}) => {
  return (
    <TableRow key={appointment.id}>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{format(new Date(appointment.date), "dd MMM yyyy", { locale: fr })}</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(appointment.date), "HH:mm", { locale: fr })}
          </span>
        </div>
      </TableCell>
      <TableCell>{appointment.title}</TableCell>
      <TableCell>{contactName || 'Contact inconnu'}</TableCell>
      <TableCell>{appointment.duration} min</TableCell>
      <TableCell className="text-right">
        <PendingAppointmentActions
          appointmentId={appointment.id}
          contactId={appointment.contactId}
          isProcessing={isProcessing}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      </TableCell>
    </TableRow>
  );
};

export default PendingAppointmentRow;
