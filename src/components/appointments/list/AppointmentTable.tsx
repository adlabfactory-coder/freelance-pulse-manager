
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { CardContent } from "@/components/ui/card";
import AppointmentTableHeader from "./AppointmentTableHeader";
import AppointmentRow from "./AppointmentRow";
import { Appointment } from "@/types/appointment";

interface AppointmentTableProps {
  appointments: Appointment[];
  contacts: {[key: string]: string};
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ 
  appointments, 
  contacts 
}) => {
  return (
    <CardContent>
      <div className="rounded-md border">
        <Table>
          <AppointmentTableHeader />
          <TableBody>
            {appointments.map((appointment) => (
              <AppointmentRow 
                key={appointment.id}
                appointment={appointment}
                contactName={contacts[appointment.contactId] || 'Contact inconnu'}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  );
};

export default AppointmentTable;
