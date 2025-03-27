
import { supabase } from "@/lib/supabase";
import { Appointment } from "@/types/appointment";

// Fonction pour récupérer tous les rendez-vous
export const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .is('deleted_at', null);

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }

    // Normaliser les données pour s'assurer que freelancerId est toujours avec I majuscule
    const normalizedData = (data || []).map(item => {
      // Création d'un nouvel objet avec les propriétés normalisées
      const appointment = {
        ...item,
        status: item.status as Appointment['status']
      } as Appointment;
      
      // Normaliser freelancerid en freelancerId si nécessaire
      if (item.freelancerid !== undefined) {
        appointment.freelancerId = item.freelancerid;
      }
      
      return appointment;
    });

    return normalizedData;
  } catch (error) {
    console.error('Unexpected error fetching appointments:', error);
    return [];
  }
};

// Fonction pour récupérer un rendez-vous par ID
export const fetchAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching appointment by ID:', error);
      return null;
    }

    if (!data) return null;
    
    // Normaliser freelancerid en freelancerId si nécessaire
    const appointment = {
      ...data,
      status: data.status as Appointment['status']
    } as Appointment;
    
    if (data.freelancerid !== undefined) {
      appointment.freelancerId = data.freelancerid;
    }
    
    return appointment;
  } catch (error) {
    console.error('Unexpected error fetching appointment by ID:', error);
    return null;
  }
};
