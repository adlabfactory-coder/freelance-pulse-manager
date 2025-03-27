
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
      // Préparer les données pour l'envoi à la base de données
      const dataToSend = { 
        ...appointmentData 
      };

      // S'assurer que le dossier a une valeur par défaut
      if (!dataToSend.folder) {
        dataToSend.folder = 'general';
      }
      
      console.log("Données de rendez-vous envoyées à la DB:", dataToSend);

      const { data, error } = await supabase
        .rpc('create_appointment', {
          appointment_data: {
            title: dataToSend.title,
            description: dataToSend.description || null,
            date: dataToSend.date,
            duration: dataToSend.duration || 30,
            status: dataToSend.status || 'scheduled',
            contactId: dataToSend.contact_id, // Correction ici
            freelancerid: dataToSend.freelancer_id, // Correction ici
            location: dataToSend.location || null,
            notes: dataToSend.notes || null,
            folder: dataToSend.folder || 'general'
          }
        });

      if (error) {
        console.error('Error creating appointment via RPC:', error);
        throw error;
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
      // Préparer les données pour l'envoi à la base de données
      const dataToSend = { 
        ...appointmentData
      };

      // S'assurer que le dossier a une valeur par défaut
      if (!dataToSend.folder) {
        dataToSend.folder = 'general';
      }
      
      console.log("Données de rendez-vous auto-assigné envoyées à la DB:", dataToSend);
      
      const { data, error } = await supabase
        .rpc('create_auto_assign_appointment', {
          appointment_data: {
            title: dataToSend.title,
            description: dataToSend.description || null,
            date: dataToSend.date,
            duration: dataToSend.duration || 30,
            status: 'pending',
            contactId: dataToSend.contact_id, // Correction ici
            location: dataToSend.location || null,
            notes: dataToSend.notes || null,
            folder: dataToSend.folder || 'general'
          }
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
