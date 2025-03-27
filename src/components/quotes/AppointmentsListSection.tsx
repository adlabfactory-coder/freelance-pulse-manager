
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from "@/hooks/use-appointments";
import { useAuth } from "@/hooks/use-auth";
import { AppointmentStatus } from "@/types/appointment";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

// Badge de statut pour les rendez-vous
const AppointmentStatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const getVariant = () => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return "outline";
      case AppointmentStatus.COMPLETED:
        return "success";
      case AppointmentStatus.CANCELLED:
        return "destructive";
      case AppointmentStatus.PENDING:
        return "warning";
      case AppointmentStatus.NO_SHOW:
        return "secondary";
      default:
        return "default";
    }
  };

  const getLabel = () => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return "Planifié";
      case AppointmentStatus.COMPLETED:
        return "Terminé";
      case AppointmentStatus.CANCELLED:
        return "Annulé";
      case AppointmentStatus.PENDING:
        return "En attente";
      case AppointmentStatus.NO_SHOW:
        return "Absence client";
      default:
        return status;
    }
  };

  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
};

const AppointmentsListSection: React.FC = () => {
  const { user, isAdminOrSuperAdmin, isAccountManager, isFreelancer } = useAuth();
  const { appointments, isLoading } = useAppointments();

  // Filtrer les rendez-vous selon le rôle de l'utilisateur
  const filteredAppointments = React.useMemo(() => {
    if (isAdminOrSuperAdmin) {
      // Les admins et super admins voient tous les rendez-vous
      return appointments;
    } else if (isAccountManager && user?.id) {
      // Les chargés de compte voient les rendez-vous qui leur sont affectés
      return appointments.filter(app => app.freelancerId === user.id);
    } else if (isFreelancer && user?.id) {
      // Les freelances voient les rendez-vous de leurs contacts
      return appointments.filter(app => app.freelancerId === user.id);
    }
    return [];
  }, [appointments, isAdminOrSuperAdmin, isAccountManager, isFreelancer, user]);

  // Tri des rendez-vous par date (les plus récents d'abord)
  const sortedAppointments = React.useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredAppointments]);

  // Limiter à 5 rendez-vous pour ne pas surcharger la page
  const recentAppointments = sortedAppointments.slice(0, 5);

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Rendez-vous récents</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : recentAppointments.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            Aucun rendez-vous trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {format(new Date(appointment.date), "Pp", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {appointment.contactName || appointment.contactId}
                    </TableCell>
                    <TableCell>{appointment.title}</TableCell>
                    <TableCell>
                      <AppointmentStatusBadge status={appointment.status as AppointmentStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsListSection;
