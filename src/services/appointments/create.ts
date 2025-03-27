
import { toast } from 'sonner';
import { useAuth } from "@/hooks/use-auth";
import { formatDateForAPI } from "@/utils/format";
import { AppointmentStatus } from "@/types/appointment";
import { supabase } from '@/lib/supabase-client';

/**
 * Fonctions de création des rendez-vous
 */
export const createAppointment = async (appointmentData: any) => {
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

    // 1. Créer le rendez-vous
    const { data: appointmentResult, error: appointmentError } = await supabase
      .rpc('create_appointment', {
        appointment_data: {
          title: dataToSend.title,
          description: dataToSend.description || null,
          date: dataToSend.date,
          duration: dataToSend.duration || 30,
          status: dataToSend.status || 'scheduled',
          contactId: dataToSend.contactId,
          freelancerId: dataToSend.freelancerId,
          location: dataToSend.location || null,
          notes: dataToSend.notes || null,
          folder: dataToSend.folder || 'general'
        }
      });

    if (appointmentError) {
      console.error('Error creating appointment via RPC:', appointmentError);
      throw appointmentError;
    }

    // 2. Assigner explicitement le contact au freelancer si ce n'est pas déjà fait
    if (dataToSend.freelancerId && dataToSend.contactId) {
      console.log(`Assignation du contact ${dataToSend.contactId} au freelancer ${dataToSend.freelancerId}`);
      
      // Mettre à jour explicitement le statut du contact en prospect et assigner au freelancer
      const { error: updateError } = await supabase
        .from('contacts')
        .update({ 
          assignedTo: dataToSend.freelancerId,
          status: 'prospect'  // Mettre à jour le statut du contact en prospect
        })
        .eq('id', dataToSend.contactId);
      
      if (updateError) {
        console.error('Erreur lors de l\'assignation du contact au freelancer:', updateError);
        // On continue malgré l'erreur pour que le rendez-vous soit créé
      } else {
        console.log('Contact assigné avec succès au freelancer');
      }
    } else {
      console.log('Aucune assignation automatique: ID freelancer ou contact manquant', {
        freelancerId: dataToSend.freelancerId,
        contactId: dataToSend.contactId
      });
    }

    return appointmentResult;
  } catch (err) {
    console.error('Error in createAppointment:', err);
    throw err;
  }
};

/**
 * Crée un rendez-vous en attente d'assignation à un chargé de compte
 */
export const createAutoAssignAppointment = async (appointmentData: any) => {
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
    
    // Créer le rendez-vous avec le statut 'pending' pour qu'un chargé de compte puisse l'accepter
    const { data, error } = await supabase
      .rpc('create_auto_assign_appointment', {
        appointment_data: {
          title: dataToSend.title,
          description: dataToSend.description || null,
          date: dataToSend.date,
          duration: dataToSend.duration || 30,
          status: 'pending',
          contactId: dataToSend.contactId,
          location: dataToSend.location || null,
          notes: dataToSend.notes || null,
          folder: dataToSend.folder || 'general'
        }
      });

    if (error) {
      console.error('Error creating auto-assign appointment via RPC:', error);
      throw error;
    }

    console.log("Rendez-vous créé avec succès, en attente d'assignation par un chargé de compte");
    return data;
  } catch (err) {
    console.error('Error in createAutoAssignAppointment:', err);
    throw err;
  }
};
