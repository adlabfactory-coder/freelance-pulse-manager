
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Appointment } from "@/types/appointment";

// Fonction pour mettre à jour un rendez-vous
export const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
  try {
    // Vérifier que la date est valide si elle est fournie
    if (appointmentData.date) {
      const appointmentDate = new Date(appointmentData.date);
      if (isNaN(appointmentDate.getTime())) {
        console.error('Invalid date for appointment update:', appointmentData.date);
        toast.error("La date du rendez-vous est invalide");
        return null;
      }
      
      // Standardiser le format de date
      appointmentData.date = appointmentDate.toISOString();
    }
    
    const { data, error } = await supabase
      .from('appointments')
      .update(appointmentData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      toast.error("Impossible de mettre à jour le rendez-vous. " + error.message);
      return null;
    }

    toast.success("Le rendez-vous a été mis à jour avec succès");
    return {
      ...data,
      status: data.status as Appointment['status']
    };
  } catch (err) {
    console.error('Unexpected error when updating appointment:', err);
    toast.error("Une erreur inattendue s'est produite lors de la mise à jour du rendez-vous");
    return null;
  }
};
