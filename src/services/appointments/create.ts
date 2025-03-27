
import { supabase } from '@/lib/supabase';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { toast } from 'sonner';

export interface CreateAppointmentInput {
  title: string;
  description?: string;
  date: string;
  duration: number;
  contactId: string;
  freelancerId?: string;
  location?: string;
  notes?: string;
  status: AppointmentStatus;
  folder?: string; // Ajout du champ folder
}

export const createAppointment = async (data: CreateAppointmentInput): Promise<Appointment | null> => {
  try {
    // Vérifier que les données requises sont présentes
    if (!data.title || !data.date || !data.contactId) {
      toast.error('Informations manquantes pour créer le rendez-vous');
      throw new Error('Titre, date et contact sont requis');
    }

    // Récupérer l'utilisateur connecté
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    
    if (!userId && !data.freelancerId) {
      toast.error('Impossible de créer un rendez-vous sans identification');
      throw new Error('Identification requise');
    }

    // Préparation des données
    const appointmentData = {
      title: data.title,
      description: data.description || null,
      date: data.date,
      duration: data.duration,
      status: data.status,
      contactId: data.contactId,
      freelancerid: data.freelancerId || userId, // Utiliser l'ID fourni ou l'ID de l'utilisateur connecté
      location: data.location || null,
      notes: data.notes || null,
      currentUserId: userId, // Pour d'autres utilisations potentielles dans les triggers
      folder: data.folder || 'general' // Utiliser le dossier fourni ou la valeur par défaut
    };
    
    console.log("Envoi des données pour création de rendez-vous:", appointmentData);

    // Création du rendez-vous utilisant une fonction RPC (procédure stockée)
    const { data: result, error } = await supabase.rpc('create_appointment', {
      appointment_data: appointmentData
    });
    
    if (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      toast.error(`Erreur: ${error.message}`);
      throw error;
    }
    
    console.log("Rendez-vous créé avec succès:", result);
    return result as Appointment;
  } catch (error: any) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    throw error;
  }
};
