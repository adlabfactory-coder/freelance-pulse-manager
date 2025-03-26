
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Appointment } from "@/types/appointment";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface AppointmentRowProps {
  appointment: Appointment;
  contactName: string;
}

const AppointmentRow: React.FC<AppointmentRowProps> = ({ appointment, contactName }) => {
  // Fonction pour afficher le badge de statut
  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      no_show: "bg-gray-100 text-gray-800"
    };
    
    const labels: { [key: string]: string } = {
      scheduled: "Planifié",
      completed: "Terminé",
      cancelled: "Annulé",
      pending: "En attente",
      no_show: "Non présenté"
    };
    
    return (
      <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
        {labels[status] || status}
      </Badge>
    );
  };

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
      <TableCell>{contactName}</TableCell>
      <TableCell>{appointment.duration} min</TableCell>
      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Voir détails</span>
            </DropdownMenuItem>
            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
              <>
                <DropdownMenuItem className="cursor-pointer">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Reprogrammer</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer">
                  <span>Annuler</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default AppointmentRow;
