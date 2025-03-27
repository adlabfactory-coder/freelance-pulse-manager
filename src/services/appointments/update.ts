
import { supabase } from '@/lib/supabase-client';
import { AppointmentStatus } from '@/types/appointment';
import { toast } from 'sonner';

/**
 * Fonction pour mettre à jour le statut d'un rendez-vous
 */
export const updateAppointmentStatus = async (
  appointmentId: string,
  newStatus: AppointmentStatus
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error(`Erreur: ${error.message}`);
      return false;
    }

    // Déclencher un événement pour notifier les composants de la mise à jour
    window.dispatchEvent(new CustomEvent('appointment-status-updated'));

    toast.success('Statut du rendez-vous mis à jour avec succès');
    
    // Vérifier si le rendez-vous a été replanifié (ne pas utiliser RESCHEDULED qui n'existe pas)
    if (newStatus === AppointmentStatus.SCHEDULED) {
      toast.info('Le rendez-vous a été replanifié');
    }

    return true;
  } catch (error: any) {
    console.error('Erreur inattendue lors de la mise à jour du statut:', error);
    toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`);
    return false;
  }
};

/**
 * Fonction pour supprimer un rendez-vous (supression logique)
 */
export const deleteAppointment = async (appointmentId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('appointments')
      .update({ deleted_at: now })
      .eq('id', appointmentId);

    if (error) {
      console.error('Erreur lors de la suppression du rendez-vous:', error);
      toast.error(`Erreur: ${error.message}`);
      return false;
    }

    // Déclencher un événement pour notifier les composants de la suppression
    window.dispatchEvent(new CustomEvent('appointment-deleted'));

    toast.success('Rendez-vous supprimé avec succès');
    return true;
  } catch (error: any) {
    console.error('Erreur inattendue lors de la suppression du rendez-vous:', error);
    toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`);
    return false;
  }
};
