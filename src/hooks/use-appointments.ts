
import { useState, useEffect, useCallback } from 'react';
import { appointmentsService } from '@/services/supabase/appointments';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './use-auth';

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
      const normalizedData = data.map(item => {
        const appointment: any = { ...item };
        
        // Normaliser freelancerid en freelancerId si nécessaire
        if ('freelancerid' in item && !('freelancerId' in item)) {
          appointment.freelancerId = item.freelancerid;
          delete appointment.freelancerid;
        }
        
        return appointment as Appointment;
      });
      
      setAppointments(normalizedData);
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors du chargement des rendez-vous';
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMsg
      });
    } finally {
      setIsLoading(false);
    }
  }, [contactId, user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await appointmentsService.createAppointment(appointmentData);
      
      if (result) {
        toast({
          title: "Rendez-vous créé",
          description: "Le rendez-vous a été créé avec succès."
        });
        await fetchAppointments(); // Refresh the list
        return result;
      }
      throw new Error("Échec de la création du rendez-vous");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la création du rendez-vous';
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMsg
      });
      throw err;
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus) => {
    try {
      const success = await appointmentsService.updateAppointment(appointmentId, { status });
      
      if (success) {
        toast({
          title: "Statut mis à jour",
          description: `Le rendez-vous a été marqué comme ${status}.`
        });
        await fetchAppointments(); // Refresh the list
        return true;
      }
      throw new Error("Échec de la mise à jour du statut");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la mise à jour du statut';
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMsg
      });
      return false;
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      const success = await appointmentsService.deleteAppointment(appointmentId);
      
      if (success) {
        toast({
          title: "Rendez-vous supprimé",
          description: "Le rendez-vous a été supprimé avec succès."
        });
        await fetchAppointments(); // Refresh the list
        return true;
      }
      throw new Error("Échec de la suppression du rendez-vous");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la suppression du rendez-vous';
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMsg
      });
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
