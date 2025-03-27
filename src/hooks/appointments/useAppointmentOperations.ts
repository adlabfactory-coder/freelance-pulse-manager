
import { useState } from "react";
import { createAppointment, createAutoAssignAppointment } from "@/services/appointments/create";
import { formatDateForAPI } from "@/utils/format";
import { AppointmentStatus } from "@/types/appointment";
import { toast } from "sonner";

export const useAppointmentOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAppointment = async ({
    title,
    description,
    date,
    time,
    duration,
    contactId,
    freelancerId,
    folder = "general",
    autoAssign = false
  }: {
    title: string;
    description: string;
    date: Date | undefined;
    time: string;
    duration: number;
    contactId: string;
    freelancerId: string | null;
    folder?: string;
    autoAssign?: boolean;
  }) => {
    if (!date) {
      toast.error("Veuillez sélectionner une date valide");
      return null;
    }
    
    if (!contactId) {
      toast.error("Veuillez sélectionner un contact pour ce rendez-vous");
      return null;
    }
    
    try {
      setIsSubmitting(true);
      console.log("useAppointmentOperations: Début de la soumission du rendez-vous...");
      
      const appointmentDate = formatDateForAPI(date, time);
      
      if (!appointmentDate) {
        toast.error("Format de date ou d'heure invalide");
        return null;
      }
      
      console.log("useAppointmentOperations: Informations du rendez-vous:", {
        title,
        contactId,
        freelancerId,
        appointmentDate,
        autoAssign
      });
      
      if (!freelancerId && !autoAssign) {
        console.log("useAppointmentOperations: Aucun freelancer disponible, passage en mode auto-assignation");
        toast.info("Aucun freelancer disponible, le rendez-vous sera auto-assigné");
      }
      
      const appointmentData = {
        title,
        description,
        date: appointmentDate,
        duration,
        status: (!freelancerId || autoAssign) ? AppointmentStatus.PENDING : AppointmentStatus.SCHEDULED,
        contact_id: contactId,
        freelancer_id: freelancerId || undefined,
        location: null,
        notes: null,
        folder: folder
      };
      
      console.log("useAppointmentOperations: Soumission des données de rendez-vous:", appointmentData);
      
      let result;
      if (!freelancerId || autoAssign) {
        result = await createAutoAssignAppointment(appointmentData);
      } else {
        result = await createAppointment(appointmentData);
      }
      
      if (result) {
        console.log("useAppointmentOperations: Rendez-vous créé avec succès:", result);
        window.dispatchEvent(new CustomEvent('appointment-created'));
        toast.success("Rendez-vous créé avec succès");
        return result;
      }
      
      return null;
    } catch (error) {
      console.error("useAppointmentOperations: Erreur lors de la création du rendez-vous:", error);
      toast.error("Impossible de créer le rendez-vous. Veuillez réessayer.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitAppointment
  };
};
