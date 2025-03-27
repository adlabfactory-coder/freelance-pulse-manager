
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";

// Types pour les données de l'appointment
interface AppointmentCreateData {
  title: string;
  description?: string | null;
  date: string;
  duration: number;
  status: AppointmentStatus;
  contact_id: string;  // Utiliser la bonne casse pour correspondre à la base de données
  freelancer_id?: string;  // Utiliser la bonne casse pour correspondre à la base de données
  location?: string | null;
  notes?: string | null;
  folder?: string;
  current_user_id?: string;  // Utiliser la bonne casse pour correspondre à la base de données
}

/**
 * Crée un rendez-vous standard avec un freelancer assigné
 */
export const createAppointment = async (appointmentData: AppointmentCreateData): Promise<Appointment | null> => {
  try {
    console.log("Envoi des données pour création de rendez-vous:", appointmentData);
    
    // Vérifier que les données requises sont présentes
    if (!appointmentData.title || !appointmentData.date || !appointmentData.contact_id || !appointmentData.freelancer_id) {
      throw new Error("Données de rendez-vous incomplètes");
    }
    
    // Appeler la procédure stockée ou la fonction RPC pour créer le rendez-vous
    const { data, error } = await supabase.rpc('create_appointment', {
      appointment_data: {
        title: appointmentData.title,
        description: appointmentData.description || null,
        date: appointmentData.date,
        duration: appointmentData.duration || 30,
        status: appointmentData.status || 'scheduled',
        contact_id: appointmentData.contact_id,
        freelancer_id: appointmentData.freelancer_id,
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
    return data as Appointment;
  } catch (error: any) {
    console.error("Erreur lors de la création du rendez-vous:", error);
    throw error;
  }
};

/**
 * Crée un rendez-vous en attente d'assignation à un freelancer
 */
export const createAutoAssignAppointment = async (appointmentData: AppointmentCreateData): Promise<Appointment | null> => {
  try {
    // Vérifier que les données requises sont présentes
    if (!appointmentData.title || !appointmentData.date || !appointmentData.contact_id) {
      throw new Error("Données de rendez-vous incomplètes");
    }
    
    // S'assurer que le statut est "pending" pour les rendez-vous auto-assignés
    appointmentData.status = AppointmentStatus.PENDING;
    
    // Appeler la procédure stockée ou la fonction RPC pour créer le rendez-vous
    const { data, error } = await supabase.rpc('create_auto_assign_appointment', {
      appointment_data: {
        title: appointmentData.title,
        description: appointmentData.description || null,
        date: appointmentData.date,
        duration: appointmentData.duration || 30,
        status: 'pending',  // Toujours en attente
        contact_id: appointmentData.contact_id,
        location: appointmentData.location || null,
        notes: appointmentData.notes || null,
        folder: appointmentData.folder || 'general',
        current_user_id: appointmentData.current_user_id || null
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
    throw error;
  }
};
