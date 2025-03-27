
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fonctions de suppression des rendez-vous
 */
export const createAppointmentsDeleteService = (supabase: SupabaseClient) => {
  /**
   * Supprime un rendez-vous (suppression logique)
   */
  const deleteAppointment = async (appointmentId: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', appointmentId);

    if (error) {
      console.error('Error deleting appointment:', error);
      return false;
    }

    return true;
  };

  return {
    deleteAppointment
  };
};
