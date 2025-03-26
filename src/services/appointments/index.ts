
// Import the correct toast from hooks
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Appointment, AppointmentStatusFromDB } from "@/types/appointment";
import { processNotification } from "@/services/notification-service";
import { NotificationType } from "@/types/notification-settings";

// Function to fetch all appointments
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

// Function to fetch a single appointment by ID
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

// Function to create a new appointment
export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Vérifier que la date est valide avant d'envoyer à la base de données
    const appointmentDate = new Date(appointmentData.date);
    if (isNaN(appointmentDate.getTime())) {
      console.error('Invalid date for appointment:', appointmentData.date);
      toast.error("La date du rendez-vous est invalide");
      return null;
    }

    console.log('Creating appointment with data:', {
      ...appointmentData,
      date: appointmentDate.toISOString()
    });
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        ...appointmentData,
        date: appointmentDate.toISOString() // Standardiser le format de date
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      toast.error("Impossible de créer le rendez-vous. " + error.message);
      return null;
    }

    // Send notification for appointment creation
    try {
      const notificationData = {
        appointmentTitle: data.title,
        appointmentDate: new Date(data.date).toLocaleDateString(),
        appointmentTime: new Date(data.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appointmentDescription: data.description || 'Pas de description',
        freelancerName: "Un freelance" // This would be replaced with the actual name in a real implementation
      };

      // Only process notification if we have required data
      if (data.freelancerId) {
        // Get freelancer name
        const { data: freelancer } = await supabase
          .from('users')
          .select('name')
          .eq('id', data.freelancerId)
          .single();
        
        if (freelancer) {
          notificationData.freelancerName = freelancer.name;
        }

        await processNotification(
          NotificationType.APPOINTMENT_CREATED,
          notificationData,
          [
            { email: 'admin@example.com', role: 'admin' },
            { email: 'superadmin@example.com', role: 'superadmin' }
          ]
        );
      }
    } catch (notificationError) {
      console.error('Error sending appointment notification:', notificationError);
      // We don't throw here to not break the appointment creation flow
    }

    toast.success("Le rendez-vous a été créé avec succès");
    return {
      ...data,
      status: data.status as Appointment['status']
    };
  } catch (err) {
    console.error('Unexpected error when creating appointment:', err);
    toast.error("Une erreur inattendue s'est produite lors de la création du rendez-vous");
    return null;
  }
};

// Function to update an appointment
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

// Function to delete an appointment
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
