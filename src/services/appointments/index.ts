
// Import the correct toast from hooks
import { toast } from "@/hooks/use-toast";
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
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le rendez-vous. " + error.message
      });
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

    toast({
      title: "Succès",
      description: "Le rendez-vous a été créé avec succès"
    });
    return {
      ...data,
      status: data.status as Appointment['status']
    };
  } catch (err) {
    console.error('Unexpected error when creating appointment:', err);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur inattendue s'est produite lors de la création du rendez-vous"
    });
    return null;
  }
};

// Function to update an appointment
export const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointmentData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le rendez-vous. " + error.message
      });
      return null;
    }

    toast({
      title: "Succès",
      description: "Le rendez-vous a été mis à jour avec succès"
    });
    return {
      ...data,
      status: data.status as Appointment['status']
    };
  } catch (err) {
    console.error('Unexpected error when updating appointment:', err);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur inattendue s'est produite lors de la mise à jour du rendez-vous"
    });
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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous. " + error.message
      });
      return false;
    }

    toast({
      title: "Succès",
      description: "Le rendez-vous a été supprimé avec succès"
    });
    return true;
  } catch (err) {
    console.error('Unexpected error when deleting appointment:', err);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur inattendue s'est produite lors de la suppression du rendez-vous"
    });
    return false;
  }
};
