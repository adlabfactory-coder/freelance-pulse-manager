
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

// Fonction pour supprimer un rendez-vous
export const deleteAppointment = async (id: string) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting appointment:', error);
      toast.error("Impossible de supprimer le rendez-vous. " + error.message);
      return false;
    }

    toast.success("Le rendez-vous a été supprimé avec succès");
    return true;
  } catch (err) {
    console.error('Unexpected error when deleting appointment:', err);
    toast.error("Une erreur inattendue s'est produite lors de la suppression du rendez-vous");
    return false;
  }
};
