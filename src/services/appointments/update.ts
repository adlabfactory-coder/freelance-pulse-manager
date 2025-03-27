
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { AppointmentStatus } from "@/types/appointment";

// Fonction pour mettre à jour le statut d'un rendez-vous
export const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating appointment status:', error);
      toast.error("Impossible de mettre à jour le statut du rendez-vous. " + error.message);
      return false;
    }

    const statusText = status === AppointmentStatus.SCHEDULED 
      ? "replanifié" 
      : status === AppointmentStatus.COMPLETED 
        ? "terminé" 
        : status === AppointmentStatus.CANCELLED 
          ? "annulé" 
          : status === AppointmentStatus.NO_SHOW 
            ? "marqué comme absence client" 
            : "mis à jour";
            
    toast.success(`Le rendez-vous a été ${statusText}`);
    return true;
  } catch (err) {
    console.error('Unexpected error when updating appointment status:', err);
    toast.error("Une erreur inattendue s'est produite lors de la mise à jour du statut");
    return false;
  }
};

// Fonction pour mettre à jour un rendez-vous
export const updateAppointment = async (id: string, updates: any) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating appointment:', error);
      toast.error("Impossible de mettre à jour le rendez-vous. " + error.message);
      return false;
    }

    toast.success("Le rendez-vous a été mis à jour avec succès");
    return true;
  } catch (err) {
    console.error('Unexpected error when updating appointment:', err);
    toast.error("Une erreur inattendue s'est produite lors de la mise à jour du rendez-vous");
    return false;
  }
};

// Fonction pour replanifier un rendez-vous
export const rescheduleAppointment = async (id: string, newDate: Date, newDuration?: number) => {
  const updates: any = {
    date: newDate.toISOString(),
    status: AppointmentStatus.SCHEDULED
  };
  
  if (newDuration) {
    updates.duration = newDuration;
  }
  
  try {
    const { error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error rescheduling appointment:', error);
      toast.error("Impossible de replanifier le rendez-vous. " + error.message);
      return false;
    }

    toast.success("Le rendez-vous a été replanifié avec succès");
    return true;
  } catch (err) {
    console.error('Unexpected error when rescheduling appointment:', err);
    toast.error("Une erreur inattendue s'est produite lors de la replanification du rendez-vous");
    return false;
  }
};
