import { supabase } from "@/lib/supabase";
import { AppointmentStatus } from "@/types";
import { processNotification } from "@/services/notification-service";
import { NotificationType } from "@/types/notification-settings";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { Appointment } from "@/types/appointment";

export interface AppointmentInput {
  title: string;
  description: string;
  date: string;
  duration: number;
  status: "scheduled" | "cancelled" | "completed" | "pending";
  freelancerId: string;
  contactId: string;
  location: any;
  notes: any;
}

export const createAppointment = async (data: AppointmentInput) => {
  try {
    // Insertion de l'appointment
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([data])
      .select('*, freelancer:freelancerId(id, name, email, role)')
      .single();

    if (error) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      return null;
    }

    // Récupérer les utilisateurs admins, superadmins et chargés d'affaires
    const { data: adminUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, role')
      .in('role', ['admin', 'superadmin', 'account_manager']);

    if (usersError) {
      console.error("Erreur lors de la récupération des utilisateurs:", usersError);
    }

    // Envoyer des notifications
    if (appointment && adminUsers) {
      // Récupérer le créateur
      const freelancer = appointment.freelancer;
      
      // Formater la date et l'heure
      const formattedDate = format(new Date(appointment.date), 'dd/MM/yyyy', { locale: fr });
      const formattedTime = format(new Date(appointment.date), 'HH:mm', { locale: fr });
      
      // Construire la liste des destinataires
      const recipients = adminUsers.map(user => ({
        email: user.email,
        role: user.role,
      }));
      
      // Ajouter le freelancer à la liste des destinataires
      if (freelancer) {
        recipients.push({
          email: freelancer.email,
          role: freelancer.role,
        });
      }
      
      // Données pour les templates
      const notificationData = {
        freelancerName: freelancer?.name || "Un utilisateur",
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        appointmentTitle: appointment.title,
        appointmentDescription: appointment.description || ""
      };
      
      // Envoyer la notification
      await processNotification(
        NotificationType.APPOINTMENT_CREATED,
        notificationData,
        recipients
      );
    }

    return appointment;
  } catch (error) {
    console.error("Erreur inattendue lors de la création du rendez-vous:", error);
    return null;
  }
};

export const appointmentService = {
  // Récupère tous les rendez-vous
  async getAppointments(): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .is('deleted_at', null)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
        throw error;
      }
      
      // Conversion explicite des données au format Appointment[]
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'scheduled' | 'cancelled' | 'completed' | 'pending'
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      return [];
    }
  },

  // Récupère les rendez-vous d'un freelancer spécifique
  async getFreelancerAppointments(freelancerId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('freelancerId', freelancerId)
        .is('deleted_at', null)
        .order('date', { ascending: true });
      
      if (error) {
        console.error(`Erreur lors de la récupération des rendez-vous du freelancer ${freelancerId}:`, error);
        throw error;
      }
      
      // Conversion explicite des données au format Appointment[]
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'scheduled' | 'cancelled' | 'completed' | 'pending'
      }));
    } catch (error) {
      console.error(`Erreur lors de la récupération des rendez-vous du freelancer ${freelancerId}:`, error);
      return [];
    }
  },

  // Récupère un rendez-vous spécifique par son ID
  async getAppointmentById(appointmentId: string): Promise<Appointment | null> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .is('deleted_at', null)
        .single();
      
      if (error) {
        console.error(`Erreur lors de la récupération du rendez-vous ${appointmentId}:`, error);
        throw error;
      }
      
      // Conversion explicite des données au format Appointment
      return data ? {
        ...data,
        status: data.status as 'scheduled' | 'cancelled' | 'completed' | 'pending'
      } : null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du rendez-vous ${appointmentId}:`, error);
      return null;
    }
  },

  // Crée un nouveau rendez-vous
  async createAppointment(appointmentData: AppointmentInput): Promise<Appointment | null> {
    try {
      // Vérifier si la date et l'heure sont disponibles pour le freelancer
      const appointmentDate = new Date(appointmentData.date);
      const endTime = new Date(appointmentDate.getTime() + appointmentData.duration * 60000);
      
      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('*')
        .eq('freelancerId', appointmentData.freelancerId)
        .is('deleted_at', null)
        .gte('date', appointmentDate.toISOString())
        .lt('date', endTime.toISOString());
      
      if (checkError) {
        console.error('Erreur lors de la vérification de disponibilité:', checkError);
        throw checkError;
      }
      
      if (existingAppointments && existingAppointments.length > 0) {
        toast({
          variant: "destructive",
          title: "Conflit d'horaire",
          description: "Le créneau horaire sélectionné n'est pas disponible pour ce freelancer."
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          ...appointmentData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la création du rendez-vous:', error);
        throw error;
      }
      
      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été créé avec succès."
      });
      
      // Conversion explicite des données au format Appointment
      return data ? {
        ...data,
        status: data.status as 'scheduled' | 'cancelled' | 'completed' | 'pending'
      } : null;
    } catch (error: any) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de créer le rendez-vous: ${error.message}`
      });
      
      return null;
    }
  },

  // Met à jour un rendez-vous existant
  async updateAppointment(appointmentId: string, appointmentData: Partial<AppointmentInput>): Promise<Appointment | null> {
    try {
      // Vérifier si la date et l'heure sont modifiées
      if (appointmentData.date || appointmentData.duration) {
        // Récupérer l'appointment actuel
        const { data: currentAppointment, error: fetchError } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', appointmentId)
          .single();
        
        if (fetchError) {
          console.error(`Erreur lors de la récupération du rendez-vous ${appointmentId}:`, fetchError);
          throw fetchError;
        }
        
        const newDate = appointmentData.date ? new Date(appointmentData.date) : new Date(currentAppointment.date);
        const newDuration = appointmentData.duration || currentAppointment.duration;
        const endTime = new Date(newDate.getTime() + newDuration * 60000);
        
        // Vérifier les conflits
        const { data: existingAppointments, error: checkError } = await supabase
          .from('appointments')
          .select('*')
          .eq('freelancerId', appointmentData.freelancerId || currentAppointment.freelancerId)
          .neq('id', appointmentId)
          .is('deleted_at', null)
          .gte('date', newDate.toISOString())
          .lt('date', endTime.toISOString());
        
        if (checkError) {
          console.error('Erreur lors de la vérification de disponibilité:', checkError);
          throw checkError;
        }
        
        if (existingAppointments && existingAppointments.length > 0) {
          toast.error("Conflit d'horaire", {
            description: "Le créneau horaire sélectionné n'est pas disponible pour ce freelancer."
          });
          return null;
        }
      }
      
      const { data, error } = await supabase
        .from('appointments')
        .update({
          ...appointmentData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', appointmentId)
        .select()
        .single();
      
      if (error) {
        console.error(`Erreur lors de la mise à jour du rendez-vous ${appointmentId}:`, error);
        throw error;
      }
      
      toast.success("Rendez-vous mis à jour", {
        description: "Le rendez-vous a été mis à jour avec succès."
      });
      
      // Conversion explicite des données au format Appointment
      return data ? {
        ...data,
        status: data.status as 'scheduled' | 'cancelled' | 'completed' | 'pending'
      } : null;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du rendez-vous ${appointmentId}:`, error);
      
      toast.error("Erreur", {
        description: `Impossible de mettre à jour le rendez-vous: ${error.message}`
      });
      
      return null;
    }
  },

  // Supprime un rendez-vous (soft delete)
  async deleteAppointment(appointmentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', appointmentId);
      
      if (error) {
        console.error(`Erreur lors de la suppression du rendez-vous ${appointmentId}:`, error);
        throw error;
      }
      
      toast.success("Rendez-vous supprimé", {
        description: "Le rendez-vous a été supprimé avec succès."
      });
      
      return true;
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du rendez-vous ${appointmentId}:`, error);
      
      toast.error("Erreur", {
        description: `Impossible de supprimer le rendez-vous: ${error.message}`
      });
      
      return false;
    }
  }
};

export default appointmentService;
