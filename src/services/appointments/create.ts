
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Appointment } from "@/types/appointment";
import { processNotification } from "@/services/notification-service";
import { NotificationType } from "@/types/notification-settings";

// Fonction pour créer un nouveau rendez-vous
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
