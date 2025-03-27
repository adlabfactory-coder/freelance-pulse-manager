
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fonctions de création des rendez-vous
 */
export const createAppointmentsCreateService = (supabase: SupabaseClient) => {
  /**
   * Crée un nouveau rendez-vous
   */
  const createAppointment = async (appointmentData: any) => {
    try {
      // S'assurer que nous utilisons freelancerid pour la base de données
      const dataToSend = { 
        ...appointmentData 
      };
      
      // Si freelancerId est fourni, le copier vers freelancerid pour la DB
      if (appointmentData.freelancerId !== undefined) {
        dataToSend.freelancerid = appointmentData.freelancerId;
        // Supprimer freelancerId pour éviter les conflits
        delete dataToSend.freelancerId;
      }

      // S'assurer que le dossier a une valeur par défaut
      if (!dataToSend.folder) {
        dataToSend.folder = 'general';
      }
      
      console.log("Données de rendez-vous envoyées à la DB:", dataToSend);

      const { data, error } = await supabase
        .rpc('create_appointment', {
          appointment_data: dataToSend
        });

      if (error) {
        console.error('Error creating appointment via RPC:', error);
        throw error;
      }

      // Normaliser la réponse pour l'application
      if (data && data.freelancerid) {
        data.freelancerId = data.freelancerid;
      }

      return data;
    } catch (err) {
      console.error('Error in createAppointment:', err);
      throw err;
    }
  };

  /**
   * Crée un rendez-vous auto-assigné
   */
  const createAutoAssignAppointment = async (appointmentData: any) => {
    try {
      // S'assurer que nous utilisons freelancerid pour la base de données
      const dataToSend = { 
        ...appointmentData
      };
      
      // Supprimer freelancerId pour la base de données
      if (dataToSend.freelancerId !== undefined) {
        delete dataToSend.freelancerId;
      }

      // S'assurer que le dossier a une valeur par défaut
      if (!dataToSend.folder) {
        dataToSend.folder = 'general';
      }
      
      console.log("Données de rendez-vous auto-assigné envoyées à la DB:", dataToSend);
      
      const { data, error } = await supabase
        .rpc('create_auto_assign_appointment', {
          appointment_data: dataToSend
        });

      if (error) {
        console.error('Error creating auto-assign appointment via RPC:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error in createAutoAssignAppointment:', err);
      throw err;
    }
  };

  return {
    createAppointment,
    createAutoAssignAppointment
  };
};
