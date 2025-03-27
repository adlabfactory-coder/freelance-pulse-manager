
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";

// Types pour les données de l'appointment
export interface AppointmentCreateData {
  title: string;
  description?: string | null;
  date: string;
  duration: number;
  status: AppointmentStatus;
  contactId: string;
  freelancerId?: string;
  location?: string | null;
  notes?: string | null;
  folder?: string;
}

/**
 * Crée un rendez-vous standard avec un freelancer assigné
 */
export const createAppointment = async (appointmentData: AppointmentCreateData): Promise<Appointment | null> => {
  try {
    console.log("Envoi des données pour création de rendez-vous:", appointmentData);
    
    // Vérifier que les données requises sont présentes
    if (!appointmentData.title || !appointmentData.date || !appointmentData.contactId) {
      throw new Error("Données de rendez-vous incomplètes");
    }
    
    // Appeler la procédure stockée pour créer le rendez-vous
    const { data, error } = await supabase.rpc('create_appointment', {
      appointment_data: {
        title: appointmentData.title,
        description: appointmentData.description || null,
        date: appointmentData.date,
        duration: appointmentData.duration || 30,
        status: appointmentData.status || 'scheduled',
        contactId: appointmentData.contactId, // Consistent naming
        freelancerid: appointmentData.freelancerId, // Keep as freelancerid for DB compatibility
        location: appointmentData.location || null,
        notes: appointmentData.notes || null,
        folder: appointmentData.folder || 'general'
      }
    });
    
    if (error) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      throw error;
    }
    
    console.log("Rendez-vous créé avec succès:", data);
    
    // Si le freelancer est spécifié, assigner explicitement le contact à ce freelancer
    if (appointmentData.freelancerId && appointmentData.contactId) {
      console.log(`Assignation du contact ${appointmentData.contactId} au freelancer ${appointmentData.freelancerId}`);
      
      const { error: updateError } = await supabase
        .from('contacts')
        .update({ 
          assignedTo: appointmentData.freelancerId,
          status: 'prospect'  // Mettre à jour le statut du contact en prospect
        })
        .eq('id', appointmentData.contactId);
      
      if (updateError) {
        console.error('Erreur lors de l\'assignation du contact au freelancer:', updateError);
        // On n'abandonne pas l'opération si l'assignation échoue
      } else {
        console.log('Contact assigné avec succès au freelancer');
      }
    }
    
    toast.success("Rendez-vous créé avec succès");
    return data as Appointment;
  } catch (error: any) {
    console.error("Erreur lors de la création du rendez-vous:", error);
    toast.error("Erreur: " + (error.message || "Une erreur est survenue"));
    throw error;
  }
};

/**
 * Crée un rendez-vous en attente d'assignation à un chargé de compte
 */
export const createAutoAssignAppointment = async (appointmentData: AppointmentCreateData): Promise<Appointment | null> => {
  try {
    // Vérifier que les données requises sont présentes
    if (!appointmentData.title || !appointmentData.date || !appointmentData.contactId) {
      throw new Error("Données de rendez-vous incomplètes");
    }
    
    // S'assurer que le statut est "pending" pour les rendez-vous auto-assignés
    appointmentData.status = AppointmentStatus.PENDING;
    
    // Appeler la procédure stockée pour créer le rendez-vous
    const { data, error } = await supabase.rpc('create_auto_assign_appointment', {
      appointment_data: {
        title: appointmentData.title,
        description: appointmentData.description || null,
        date: appointmentData.date,
        duration: appointmentData.duration || 30,
        status: 'pending',
        contactId: appointmentData.contactId, // Consistent naming
        location: appointmentData.location || null,
        notes: appointmentData.notes || null,
        folder: appointmentData.folder || 'general'
      }
    });
    
    if (error) {
      console.error("Erreur lors de la création du rendez-vous auto-assigné:", error);
      throw error;
    }
    
    console.log("Rendez-vous auto-assigné créé avec succès:", data);
    toast.success("Rendez-vous en attente d'assignation créé avec succès");
    
    return data as Appointment;
  } catch (error: any) {
    console.error("Erreur lors de la création du rendez-vous auto-assigné:", error);
    toast.error("Erreur: " + (error.message || "Une erreur est survenue"));
    throw error;
  }
};
