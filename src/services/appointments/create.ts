
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Appointment, AppointmentStatus } from "@/types/appointment";

// Créer un nouveau rendez-vous
export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment | null> => {
  try {
    console.log("Création d'un rendez-vous avec les données:", appointmentData);

    // S'assurer que freelancerid est utilisé correctement pour la base de données
    const dataToSend = {
      ...appointmentData,
      // freelancerid doit être renseigné - utiliser le freelancerId de l'application ou un ID par défaut
      freelancerid: appointmentData.freelancerId || appointmentData.currentUserId || null
    };

    // Vérifier si freelancerid est défini, sinon lever une erreur explicite
    if (!dataToSend.freelancerid) {
      toast.error("Un freelancer doit être assigné au rendez-vous");
      throw new Error("Le champ freelancerid est requis");
    }

    // Supprimer freelancerId car la base de données utilise freelancerid
    if ('freelancerId' in dataToSend) {
      delete (dataToSend as any).freelancerId;
    }

    // Supprimer currentUserId s'il existe car c'est juste pour l'interface
    if ('currentUserId' in dataToSend) {
      delete (dataToSend as any).currentUserId;
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
    
    // Normaliser la réponse pour l'application
    const normalizedData = {
      ...data,
      // Assurer que freelancerId est présent pour la cohérence interne
      freelancerId: data.freelancerid
    };
    
    // Déclencher l'événement de création de rendez-vous
    window.dispatchEvent(new CustomEvent('appointment-created'));
    
    return normalizedData;
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
    
    // Récupérer un freelancer par défaut pour satisfaire la contrainte not-null
    const { data: defaultFreelancer, error: freelancerError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'freelancer')
      .limit(1)
      .single();
      
    if (freelancerError || !defaultFreelancer) {
      console.error("Erreur: Impossible de trouver un freelancer par défaut", freelancerError);
      toast.error("Impossible de créer un rendez-vous sans freelancer");
      throw new Error("Un freelancer par défaut est requis pour créer un rendez-vous auto-assigné");
    }
    
    // S'assurer que freelancerid est présent pour satisfaire la contrainte not-null
    const cleanedData = {
      ...appointmentData,
      status: AppointmentStatus.PENDING,
      freelancerid: defaultFreelancer.id
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
    
    // Normaliser la réponse pour l'application
    const normalizedData = {
      ...data,
      // Pour garder la cohérence dans l'application
      freelancerId: data.freelancerid
    };
    
    // Déclencher l'événement de création de rendez-vous
    window.dispatchEvent(new CustomEvent('appointment-created'));
    
    return normalizedData;
  } catch (err) {
    console.error('Erreur inattendue lors de la création du rendez-vous auto-assigné:', err);
    toast.error("Une erreur s'est produite lors de la création du rendez-vous");
    throw err;
  }
};
