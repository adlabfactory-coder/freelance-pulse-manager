
import { supabase } from "@/lib/supabase-client";
import { Appointment, normalizeFreelancerId } from "@/types/appointment";

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
    const normalizedData = (data || []).map(app => normalizeFreelancerId(app));

    return normalizedData as Appointment[];
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
    
    // Normaliser les données pour s'assurer que freelancerId est toujours avec I majuscule
    return normalizeFreelancerId(data as Appointment);
  } catch (error) {
    console.error('Unexpected error fetching appointment by ID:', error);
    return null;
  }
};
