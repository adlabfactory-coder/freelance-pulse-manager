
import { useState, useEffect, useCallback } from 'react';
import { appointmentsService } from '@/services/supabase/appointments';
import { Appointment, AppointmentStatus, normalizeFreelancerId } from '@/types/appointment';
import { toast } from 'sonner';
import { useAuth } from './use-auth';
import { supabase } from '@/lib/supabase';

export function useAppointments(contactId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let data: Appointment[];
      
      if (contactId) {
        // Fetch appointments for a specific contact
        data = await appointmentsService.getAppointmentsByContact(contactId);
      } else if (user?.role === 'freelancer' && user?.id) {
        // Fetch appointments for the current freelancer
        data = await appointmentsService.getAppointmentsByFreelancer(user.id);
      } else {
        // Fetch all appointments
        data = await appointmentsService.getAppointments();
      }
      
      // Normaliser les données pour s'assurer que freelancerId est toujours avec I majuscule
      const normalizedData = data.map(normalizeFreelancerId);
      
      setAppointments(normalizedData);
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors du chargement des rendez-vous';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [contactId, user]);

  useEffect(() => {
    fetchAppointments();
    
    // Configurer l'écouteur pour les mises à jour en temps réel
    let channel;
    
    if (user?.role === 'freelancer' && user?.id) {
      channel = supabase
        .channel('public:appointments-freelancer')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments', filter: `freelancerid=eq.${user.id}` }, 
          () => fetchAppointments()
        )
        .subscribe();
    } else if (contactId) {
      channel = supabase
        .channel('public:appointments-contact')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments', filter: `contactId=eq.${contactId}` }, 
          () => fetchAppointments()
        )
        .subscribe();
    } else {
      channel = supabase
        .channel('public:appointments')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments' }, 
          () => fetchAppointments()
        )
        .subscribe();
    }
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchAppointments, user, contactId]);

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await appointmentsService.createAppointment(appointmentData);
      
      if (result) {
        toast.success("Rendez-vous créé avec succès");
        await fetchAppointments(); // Refresh the list
        return result;
      }
      throw new Error("Échec de la création du rendez-vous");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la création du rendez-vous';
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus) => {
    try {
      const success = await appointmentsService.updateAppointment(appointmentId, { status });
      
      if (success) {
        toast.success(`Le rendez-vous a été marqué comme ${status}.`);
        await fetchAppointments(); // Refresh the list
        return true;
      }
      throw new Error("Échec de la mise à jour du statut");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la mise à jour du statut';
      toast.error(errorMsg);
      return false;
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      const success = await appointmentsService.deleteAppointment(appointmentId);
      
      if (success) {
        toast.success("Rendez-vous supprimé avec succès");
        await fetchAppointments(); // Refresh the list
        return true;
      }
      throw new Error("Échec de la suppression du rendez-vous");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la suppression du rendez-vous';
      toast.error(errorMsg);
      return false;
    }
  };

  return {
    appointments,
    isLoading,
    error,
    refresh: fetchAppointments,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment
  };
}
