
import { supabase } from "@/lib/supabase";
import { Appointment } from "@/types/appointment";

// Fonction pour récupérer tous les rendez-vous
export const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*');

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }

    // Cast the string status to our TypeScript union type
    return (data || []).map(item => ({
      ...item,
      status: item.status as Appointment['status']
    }));
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

    // Cast the string status to our TypeScript union type
    return data ? {
      ...data,
      status: data.status as Appointment['status']
    } : null;
  } catch (error) {
    console.error('Unexpected error fetching appointment by ID:', error);
    return null;
  }
};
