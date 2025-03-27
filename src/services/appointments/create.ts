
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Appointment, AppointmentStatus } from "@/types/appointment";
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

    // Si freelancerId est null, utiliser une valeur par défaut (cela ne devrait pas arriver avec les modifications)
    const freelancerId = appointmentData.freelancerId || "00000000-0000-0000-0000-000000000000";

    console.log('Creating appointment with data:', {
      ...appointmentData,
      freelancerId,
      date: appointmentDate.toISOString()
    });
    
    // Utiliser l'option rpc avec la procédure stockée pour contourner les problèmes de RLS
    const { data, error } = await supabase
      .rpc('create_appointment', {
        appointment_data: {
          ...appointmentData,
          freelancerId,
          date: appointmentDate.toISOString() // Standardiser le format de date
        }
      });

    if (error) {
      console.error('Error creating appointment:', error);
      toast.error("Impossible de créer le rendez-vous. " + error.message);
      return null;
    }

    // Send notification for appointment creation
    try {
      const notificationData = {
        appointmentTitle: appointmentData.title,
        appointmentDate: new Date(appointmentData.date).toLocaleDateString(),
        appointmentTime: new Date(appointmentData.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appointmentDescription: appointmentData.description || 'Pas de description',
        freelancerName: "Un freelance" // This would be replaced with the actual name in a real implementation
      };

      // Only process notification if we have required data
      if (freelancerId && freelancerId !== "00000000-0000-0000-0000-000000000000") {
        // Get freelancer name
        const { data: freelancer } = await supabase
          .from('users')
          .select('name')
          .eq('id', freelancerId)
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
    return data;
  } catch (err) {
    console.error('Unexpected error when creating appointment:', err);
    toast.error("Une erreur inattendue s'est produite lors de la création du rendez-vous");
    return null;
  }
};

// Fonction pour créer un rendez-vous avec attribution automatique au premier chargé de compte qui l'accepte
export const createAutoAssignAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Vérifier que la date est valide avant d'envoyer à la base de données
    const appointmentDate = new Date(appointmentData.date);
    if (isNaN(appointmentDate.getTime())) {
      console.error('Date invalide pour le rendez-vous:', appointmentData.date);
      toast.error("La date du rendez-vous est invalide");
      return null;
    }

    // Vérifier que le contact existe
    if (!appointmentData.contactId) {
      console.error('ID de contact manquant pour le rendez-vous auto-assigné');
      toast.error("Le contact pour ce rendez-vous n'est pas spécifié");
      return null;
    }

    // Pour l'auto-assignation, nous utilisons une valeur par défaut temporaire
    // qui sera remplacée lorsqu'un chargé de compte acceptera le rendez-vous
    const appointmentDataCleaned = {
      ...appointmentData,
      freelancerId: "00000000-0000-0000-0000-000000000000" // UUID par défaut temporaire
    };

    console.log('Création d\'un rendez-vous auto-assigné:', {
      ...appointmentDataCleaned,
      date: appointmentDate.toISOString()
    });
    
    // Obtenir tous les utilisateurs avec le rôle 'account_manager'
    const { data: accountManagers, error: accountManagersError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('role', 'account_manager');
    
    if (accountManagersError) {
      console.error('Erreur lors de la récupération des chargés de compte:', accountManagersError);
      toast.error("Impossible de trouver des chargés de compte disponibles");
      return null;
    }
    
    if (!accountManagers || accountManagers.length === 0) {
      console.error('Aucun chargé de compte trouvé dans le système');
      toast.error("Aucun chargé de compte disponible pour l'attribution");
      return null;
    }
    
    // Préparer les données pour l'auto-assignation
    const autoAssignData = {
      ...appointmentDataCleaned,
      date: appointmentDate.toISOString()
    };
    
    // Utiliser l'option rpc pour contourner les problèmes de RLS
    const { data, error } = await supabase
      .rpc('create_auto_assign_appointment', {
        appointment_data: autoAssignData
      });

    if (error) {
      console.error('Erreur lors de la création du rendez-vous auto-assigné:', error);
      toast.error("Impossible de créer le rendez-vous. " + error.message);
      return null;
    }

    // Envoyer une notification à tous les chargés de compte
    try {
      // Récupérer les informations du contact
      const { data: contact } = await supabase
        .from('contacts')
        .select('name, email')
        .eq('id', appointmentData.contactId)
        .single();
      
      if (contact) {
        const notificationData = {
          appointmentTitle: appointmentData.title,
          appointmentDate: new Date(appointmentData.date).toLocaleDateString(),
          appointmentTime: new Date(appointmentData.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          appointmentDescription: appointmentData.description || 'Pas de description',
          contactName: contact.name,
          contactEmail: contact.email,
          appointmentId: data.id
        };

        // Envoyer une notification à chaque chargé de compte
        for (const manager of accountManagers) {
          await processNotification(
            NotificationType.APPOINTMENT_PENDING_ASSIGNMENT,
            {
              ...notificationData,
              managerName: manager.name
            },
            [{ email: manager.email, role: 'account_manager' }]
          );
        }
      }
    } catch (notificationError) {
      console.error('Erreur lors de l\'envoi des notifications:', notificationError);
      // Nous ne levons pas d'erreur ici pour ne pas interrompre le flux
    }

    toast.success("Rendez-vous créé et en attente d'attribution à un chargé de compte");
    return data;
  } catch (err) {
    console.error('Erreur inattendue lors de la création du rendez-vous auto-assigné:', err);
    toast.error("Une erreur inattendue s'est produite lors de la création du rendez-vous");
    return null;
  }
};
