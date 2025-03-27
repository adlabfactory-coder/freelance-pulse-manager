
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { processNotification } from "@/services/notification-service";
import { NotificationType } from "@/types/notification-settings";

// Mise à jour d'un rendez-vous
export const updateAppointment = async (
  appointmentId: string,
  updateData: Partial<Appointment>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId);

    if (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
      toast.error("Impossible de mettre à jour le rendez-vous: " + error.message);
      return false;
    }

    toast.success("Rendez-vous mis à jour avec succès");
    return true;
  } catch (err) {
    console.error('Erreur inattendue lors de la mise à jour du rendez-vous:', err);
    toast.error("Une erreur s'est produite lors de la mise à jour du rendez-vous");
    return false;
  }
};

// Mise à jour du statut d'un rendez-vous
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId);

    if (error) {
      console.error('Erreur lors de la mise à jour du statut du rendez-vous:', error);
      toast.error("Impossible de modifier le statut du rendez-vous: " + error.message);
      return false;
    }

    // Notifications selon le nouveau statut
    try {
      const { data: appointment } = await supabase
        .from('appointments')
        .select('*, contacts(name), users(name)')
        .eq('id', appointmentId)
        .single();

      if (appointment) {
        const notificationData = {
          appointmentTitle: appointment.title,
          appointmentDate: new Date(appointment.date).toLocaleDateString(),
          status: status,
          contactName: appointment.contacts?.name || 'Client inconnu',
          freelancerName: appointment.users?.name || 'Freelance'
        };

        // Envoyer des notifications différentes selon le nouveau statut
        switch (status) {
          case AppointmentStatus.COMPLETED:
            await processNotification(
              NotificationType.APPOINTMENT_COMPLETED,
              notificationData,
              [{ email: 'admin@example.com', role: 'admin' }]
            );
            break;
          case AppointmentStatus.CANCELLED:
            await processNotification(
              NotificationType.APPOINTMENT_CANCELLED,
              notificationData,
              [{ email: 'admin@example.com', role: 'admin' }]
            );
            break;
          case AppointmentStatus.NO_SHOW:
            await processNotification(
              NotificationType.APPOINTMENT_NO_SHOW,
              notificationData,
              [{ email: 'admin@example.com', role: 'admin' }]
            );
            break;
        }
      }
    } catch (notifError) {
      console.error('Erreur lors de l\'envoi des notifications de statut:', notifError);
      // Ne pas bloquer le processus si les notifications échouent
    }

    toast.success(`Statut du rendez-vous modifié en "${status}"`);
    return true;
  } catch (err) {
    console.error('Erreur inattendue lors de la mise à jour du statut:', err);
    toast.error("Une erreur s'est produite lors de la modification du statut");
    return false;
  }
};
