
import { useCallback } from 'react';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { appointmentsService } from '@/services/supabase/appointments';
import { toast } from 'sonner';

/**
 * Hook responsable des opérations CRUD sur les rendez-vous
 */
export function useAppointmentOperations(refreshCallback: () => Promise<void>) {
  const createAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await appointmentsService.createAppointment(appointmentData);
      
      if (result) {
        toast.success("Rendez-vous créé avec succès");
        await refreshCallback(); // Refresh the list
        return result;
      }
      throw new Error("Échec de la création du rendez-vous");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la création du rendez-vous';
      toast.error(errorMsg);
      throw err;
    }
  }, [refreshCallback]);

  const updateAppointmentStatus = useCallback(async (appointmentId: string, status: AppointmentStatus) => {
    try {
      const success = await appointmentsService.updateAppointment(appointmentId, { status });
      
      if (success) {
        toast.success(`Le rendez-vous a été marqué comme ${status}.`);
        await refreshCallback(); // Refresh the list
        return true;
      }
      throw new Error("Échec de la mise à jour du statut");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la mise à jour du statut';
      toast.error(errorMsg);
      return false;
    }
  }, [refreshCallback]);

  const deleteAppointment = useCallback(async (appointmentId: string) => {
    try {
      const success = await appointmentsService.deleteAppointment(appointmentId);
      
      if (success) {
        toast.success("Rendez-vous supprimé avec succès");
        await refreshCallback(); // Refresh the list
        return true;
      }
      throw new Error("Échec de la suppression du rendez-vous");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la suppression du rendez-vous';
      toast.error(errorMsg);
      return false;
    }
  }, [refreshCallback]);

  return {
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment
  };
}
