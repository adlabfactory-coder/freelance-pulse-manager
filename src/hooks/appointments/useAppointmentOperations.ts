
import { useState, useCallback } from 'react';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { appointmentsService } from '@/services/supabase/appointments';
import { toast } from 'sonner';
import { formatDateForAPI } from '@/utils/format';

/**
 * Hook responsable des opérations CRUD sur les rendez-vous
 */
export function useAppointmentOperations(refreshCallback?: () => Promise<void>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      const result = await appointmentsService.createAppointment(appointmentData);
      
      if (result) {
        toast.success("Rendez-vous créé avec succès");
        if (refreshCallback) await refreshCallback(); // Refresh the list
        return result;
      }
      throw new Error("Échec de la création du rendez-vous");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la création du rendez-vous';
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [refreshCallback]);

  const updateAppointmentStatus = useCallback(async (appointmentId: string, status: AppointmentStatus) => {
    try {
      setIsSubmitting(true);
      const success = await appointmentsService.updateAppointment(appointmentId, { status });
      
      if (success) {
        toast.success(`Le rendez-vous a été marqué comme ${status}.`);
        if (refreshCallback) await refreshCallback(); // Refresh the list
        return true;
      }
      throw new Error("Échec de la mise à jour du statut");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la mise à jour du statut';
      toast.error(errorMsg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [refreshCallback]);

  const deleteAppointment = useCallback(async (appointmentId: string) => {
    try {
      setIsSubmitting(true);
      const success = await appointmentsService.deleteAppointment(appointmentId);
      
      if (success) {
        toast.success("Rendez-vous supprimé avec succès");
        if (refreshCallback) await refreshCallback(); // Refresh the list
        return true;
      }
      throw new Error("Échec de la suppression du rendez-vous");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la suppression du rendez-vous';
      toast.error(errorMsg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [refreshCallback]);

  const submitAppointment = useCallback(async (appointmentData: any) => {
    try {
      setIsSubmitting(true);
      
      // Formater la date au format attendu par l'API
      const formattedDate = formatDateForAPI(appointmentData.date, appointmentData.time);
      
      if (!formattedDate) {
        toast.error("Format de date ou d'heure invalide");
        return false;
      }
      
      // Préparer les données pour l'API
      const apiData: Partial<Appointment> = {
        title: appointmentData.title,
        description: appointmentData.description || null,
        date: formattedDate,
        duration: parseInt(appointmentData.duration, 10),
        status: appointmentData.autoAssign ? AppointmentStatus.PENDING : AppointmentStatus.SCHEDULED,
        contactId: appointmentData.contactId,
        freelancerId: appointmentData.freelancerId,
        folder: appointmentData.folder || 'general'
      };
      
      console.log("Soumission du rendez-vous:", apiData);
      
      // Créer le rendez-vous
      let result;
      if (appointmentData.autoAssign) {
        result = await appointmentsService.createAutoAssignAppointment(apiData);
      } else {
        result = await appointmentsService.createAppointment(apiData);
      }
      
      if (result) {
        toast.success("Rendez-vous créé avec succès");
        
        // Déclencher l'événement de création de rendez-vous
        window.dispatchEvent(new CustomEvent('appointment-created'));
        
        if (refreshCallback) {
          await refreshCallback();
        }
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      toast.error(error?.message || "Une erreur est survenue lors de la création du rendez-vous");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    submitAppointment
  };
}
