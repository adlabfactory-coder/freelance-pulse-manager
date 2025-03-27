
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Appointment, AppointmentStatus } from "@/types/appointment";

// Créer un nouveau rendez-vous
export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment | null> => {
  try {
    console.log("Création d'un rendez-vous avec les données:", appointmentData);

    // S'assurer que freelancerid est utilisé correctement (et non freelancerId)
    const dataToSend = {
      ...appointmentData,
      // Si freelancerId est présent, le copier vers freelancerid
      freelancerid: appointmentData.freelancerId
    };

    // Supprimer freelancerId car la base de données utilise freelancerid
    if ('freelancerId' in dataToSend) {
      delete (dataToSend as any).freelancerId;
    }

    const { data, error } = await supabase.rpc('create_appointment', {
      appointment_data: dataToSend
    });

    if (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      toast.error("Impossible de créer le rendez-vous: " + error.message);
      throw error;
    }

    console.log("Rendez-vous créé avec succès:", data);
    
    // Normaliser la réponse en convertissant freelancerid en freelancerId
    if (data && data.freelancerid) {
      (data as any).freelancerId = data.freelancerid;
    }
    
    // Déclencher l'événement de création de rendez-vous
    window.dispatchEvent(new CustomEvent('appointment-created'));
    
    return data;
  } catch (err) {
    console.error('Erreur inattendue lors de la création du rendez-vous:', err);
    toast.error("Une erreur s'est produite lors de la création du rendez-vous");
    throw err;
  }
};

// Créer un rendez-vous auto-assigné (sans freelancer)
export const createAutoAssignAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment | null> => {
  try {
    console.log("Création d'un rendez-vous auto-assigné avec les données:", appointmentData);
    
    // S'assurer que freelancerId est null pour l'auto-assignation
    const cleanedData = {
      ...appointmentData,
      status: AppointmentStatus.PENDING,
      // Utiliser freelancerid au lieu de freelancerId
      freelancerid: null
    };
    
    // Supprimer freelancerId car la base de données utilise freelancerid
    if ('freelancerId' in cleanedData) {
      delete (cleanedData as any).freelancerId;
    }
    
    const { data, error } = await supabase.rpc('create_auto_assign_appointment', {
      appointment_data: cleanedData
    });

    if (error) {
      console.error('Erreur lors de la création du rendez-vous auto-assigné:', error);
      toast.error("Impossible de créer le rendez-vous: " + error.message);
      throw error;
    }

    console.log("Rendez-vous auto-assigné créé avec succès:", data);
    
    // Déclencher l'événement de création de rendez-vous
    window.dispatchEvent(new CustomEvent('appointment-created'));
    
    return data;
  } catch (err) {
    console.error('Erreur inattendue lors de la création du rendez-vous auto-assigné:', err);
    toast.error("Une erreur s'est produite lors de la création du rendez-vous");
    throw err;
  }
};
