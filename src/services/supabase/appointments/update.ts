
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fonctions de mise à jour des rendez-vous
 */
export const createAppointmentsUpdateService = (supabase: SupabaseClient) => {
  /**
   * Accepte un rendez-vous et l'assigne à un chargé de compte
   */
  const acceptAppointment = async (appointmentId: string, managerId: string) => {
    try {
      const { error } = await supabase
        .rpc('accept_appointment', {
          appointment_id: appointmentId,
          manager_id: managerId
        });

      if (error) {
        console.error('Error accepting appointment:', error);
        throw error;
      }

      return true;
    } catch (err) {
      console.error('Error in acceptAppointment:', err);
      throw err;
    }
  };

  /**
   * Met à jour un rendez-vous
   */
  const updateAppointment = async (appointmentId: string, updateData: any) => {
    const { error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId);

    if (error) {
      console.error('Error updating appointment:', error);
      return false;
    }

    return true;
  };

  return {
    acceptAppointment,
    updateAppointment
  };
};
