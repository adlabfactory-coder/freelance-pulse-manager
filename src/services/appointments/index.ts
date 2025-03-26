
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Types pour les rendez-vous
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  contactId: string;
  freelancerId: string;
  date: string;
  duration: number;
  status: 'scheduled' | 'cancelled' | 'completed' | 'pending';
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentInput {
  title: string;
  description?: string;
  contactId: string;
  freelancerId: string;
  date: string;
  duration: number;
  status: 'scheduled' | 'cancelled' | 'completed' | 'pending';
  location?: string;
  notes?: string;
}

// Service pour la gestion des rendez-vous
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
      
      return data || [];
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
      
      return data || [];
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
      
      return data;
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
        toast.error("Conflit d'horaire", {
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
      
      toast.success("Rendez-vous créé", {
        description: "Le rendez-vous a été créé avec succès."
      });
      
      return data;
    } catch (error: any) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      
      toast.error("Erreur", {
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
      
      return data;
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
