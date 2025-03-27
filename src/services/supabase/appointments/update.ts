
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fonctions de mise à jour des rendez-vous
 */
export const createAppointmentsUpdateService = (supabase: SupabaseClient) => {
  /**
   * Accepte un rendez-vous et l'assigne à un freelancer
   */
  const acceptAppointment = async (appointmentId: string, freelancerId: string) => {
    try {
      const { error } = await supabase
        .rpc('accept_appointment', {
          appointment_id: appointmentId,
          freelancer_id: freelancerId
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
    // Si updateData contient freelancerId, le convertir en freelancerid pour la DB
    const dataToUpdate = { ...updateData };
    if (dataToUpdate.freelancerId !== undefined) {
      dataToUpdate.freelancerid = dataToUpdate.freelancerId;
      delete dataToUpdate.freelancerId;
    }
    
    const { error } = await supabase
      .from('appointments')
      .update(dataToUpdate)
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
