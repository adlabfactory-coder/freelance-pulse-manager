
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateToFrench, formatTime } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Check, FileText, Info, MoreHorizontal, Trash, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { deleteAppointment, updateAppointmentStatus } from "@/services/appointments";
import { useAuth } from "@/hooks/use-auth";
import AddQuoteDialog from "@/components/quotes/AddQuoteDialog";
import InitialConsultationTemplate from "@/components/quotes/templates/InitialConsultationTemplate";

interface AppointmentRowProps {
  appointment: Appointment;
  onUpdate: () => void;
  onView?: (appointment: Appointment) => void;
}

const AppointmentRow: React.FC<AppointmentRowProps> = ({
  appointment,
  onUpdate,
  onView,
}) => {
  const { isAdmin, isFreelancer } = useAuth();
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [initialConsultationDialogOpen, setInitialConsultationDialogOpen] = useState(false);

  const getStatusBadgeVariant = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return "default";
      case AppointmentStatus.COMPLETED:
        return "success";
      case AppointmentStatus.CANCELLED:
        return "destructive";
      case AppointmentStatus.PENDING:
        return "warning";
      case AppointmentStatus.NO_SHOW:
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    setLoading(true);
    try {
      await updateAppointmentStatus(appointment.id, newStatus);
      toast.success(`Le statut du rendez-vous a été mis à jour`);
      onUpdate();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAppointment(appointment.id);
      toast.success("Le rendez-vous a été supprimé");
      onUpdate();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuote = () => {
    setQuoteDialogOpen(true);
  };

  const handleCreateInitialConsultation = () => {
    setInitialConsultationDialogOpen(true);
  };

  const isActionable = isAdmin || (isFreelancer && appointment.freelancerId === appointment.currentUserId);

  return (
    <TableRow>
      <TableCell>{appointment.title}</TableCell>
      <TableCell>
        {formatDateToFrench(new Date(appointment.date))} à{" "}
        {formatTime(new Date(appointment.date))}
      </TableCell>
      <TableCell>{appointment.duration} min</TableCell>
      <TableCell>{appointment.contactName}</TableCell>
      <TableCell>{appointment.freelancerName}</TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(appointment.status)}>
          {appointment.status === "scheduled"
            ? "Planifié"
            : appointment.status === "completed"
            ? "Terminé"
            : appointment.status === "cancelled"
            ? "Annulé"
            : appointment.status === "pending"
            ? "En attente"
            : appointment.status === "no_show"
            ? "Absent"
            : appointment.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setInfoDialogOpen(true)}>
                <Info className="mr-2 h-4 w-4" />
                Détails
              </DropdownMenuItem>

              {isActionable && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(AppointmentStatus.COMPLETED)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Marquer comme terminé
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(AppointmentStatus.CANCELLED)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Annuler
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(AppointmentStatus.NO_SHOW)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Client absent
                  </DropdownMenuItem>
                  
                  {appointment.status === AppointmentStatus.COMPLETED && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Actions après rendez-vous</DropdownMenuLabel>
                      <DropdownMenuItem onClick={handleCreateQuote}>
                        <FileText className="mr-2 h-4 w-4" />
                        Créer un devis
                      </DropdownMenuItem>
                      {appointment.title.toLowerCase().includes("consultation") && (
                        <DropdownMenuItem onClick={handleCreateInitialConsultation}>
                          <FileText className="mr-2 h-4 w-4" />
                          Devis consultation initiale
                        </DropdownMenuItem>
                      )}
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Modal de détails */}
        <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{appointment.title}</DialogTitle>
              <DialogDescription>
                {formatDateToFrench(new Date(appointment.date))} à{" "}
                {formatTime(new Date(appointment.date))}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {appointment.description || "Aucune description"}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Durée</h4>
                <p className="text-sm text-muted-foreground">
                  {appointment.duration} minutes
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Client</h4>
                <p className="text-sm text-muted-foreground">
                  {appointment.contactName}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Commercial</h4>
                <p className="text-sm text-muted-foreground">
                  {appointment.freelancerName}
                </p>
              </div>
              {appointment.notes && (
                <div>
                  <h4 className="font-medium mb-1">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de suppression */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer le rendez-vous</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action
                est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Suppression..." : "Supprimer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Dialog de création de devis */}
        <AddQuoteDialog 
          open={quoteDialogOpen} 
          onOpenChange={setQuoteDialogOpen} 
          initialContactId={appointment.contactId}
        />
        
        {/* Dialog de création de devis de consultation initiale */}
        <InitialConsultationTemplate
          open={initialConsultationDialogOpen}
          onOpenChange={setInitialConsultationDialogOpen}
          initialContactId={appointment.contactId}
        />
      </TableCell>
    </TableRow>
  );
};

export default AppointmentRow;
