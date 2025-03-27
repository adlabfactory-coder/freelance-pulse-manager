
import { useState } from "react";
import { createAppointment, createAutoAssignAppointment } from "@/services/appointments/create";
import { formatDateForAPI } from "@/utils/format";
import { AppointmentStatus } from "@/types/appointment";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase-client";
import { UserRole } from "@/types";

export const useAppointmentOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

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
    
    if (!user) {
      console.error("Erreur d'authentification: aucun utilisateur connecté");
      toast.error("Vous devez être connecté pour créer un rendez-vous");
      return null;
    }
    
    try {
      setIsSubmitting(true);
      console.log("useAppointmentOperations: Début de la soumission du rendez-vous...", {
        userId: user.id, 
        userRole: user.role
      });
      
      const appointmentDate = formatDateForAPI(date, time);
      
      if (!appointmentDate) {
        toast.error("Format de date ou d'heure invalide");
        return null;
      }
      
      // Déterminer le freelancer à assigner
      const finalFreelancerId = user.role === UserRole.FREELANCER 
        ? user.id 
        : freelancerId;
      
      console.log("useAppointmentOperations: Informations du rendez-vous:", {
        title,
        contactId,
        freelancerId: finalFreelancerId,
        appointmentDate,
        autoAssign,
        userRole: user.role
      });
      
      // Si l'utilisateur est un freelancer, toujours lui assigner le rendez-vous
      // Sinon, respecter la valeur d'autoAssign
      const useAutoAssign = user.role !== UserRole.FREELANCER && 
                           (autoAssign || !finalFreelancerId);
      
      if (useAutoAssign) {
        console.log("useAppointmentOperations: Mode auto-assignation activé");
        toast.info("Le rendez-vous sera assigné à un chargé de compte");
      }
      
      const appointmentData = {
        title,
        description,
        date: appointmentDate,
        duration,
        status: useAutoAssign ? AppointmentStatus.PENDING : AppointmentStatus.SCHEDULED,
        contact_id: contactId, // Changed from contactId to contact_id to match expected parameter
        freelancer_id: useAutoAssign ? undefined : finalFreelancerId, // Changed from freelancerId to freelancer_id
        location: null,
        notes: null,
        folder: folder,
        currentUserId: user.id // Ajout pour tracking
      };
      
      console.log("useAppointmentOperations: Soumission des données de rendez-vous:", appointmentData);
      
      let result;
      if (useAutoAssign) {
        result = await createAutoAssignAppointment(appointmentData);
      } else {
        result = await createAppointment(appointmentData);
        
        // Si le rendez-vous est créé par un freelancer, mettre à jour le statut du contact
        if (result && user.role === UserRole.FREELANCER && finalFreelancerId) {
          console.log("Mise à jour du statut du contact après création de rendez-vous par un freelancer");
          try {
            const { error } = await supabase
              .from('contacts')
              .update({ 
                assignedTo: finalFreelancerId,
                status: 'prospect'
              })
              .eq('id', contactId);
              
            if (error) {
              console.error("Erreur lors de la mise à jour du contact:", error);
              toast.error("Le rendez-vous a été créé, mais nous n'avons pas pu mettre à jour le statut du contact");
            } else {
              console.log("Contact mis à jour avec succès: assigné au freelancer et statut 'prospect'");
            }
          } catch (err) {
            console.error("Erreur inattendue lors de la mise à jour du contact:", err);
          }
        }
      }
      
      if (result) {
        console.log("useAppointmentOperations: Rendez-vous créé avec succès:", result);
        window.dispatchEvent(new CustomEvent('appointment-created'));
        toast.success("Rendez-vous créé avec succès");
        return result;
      } else {
        console.error("Aucun résultat retourné lors de la création du rendez-vous");
        toast.error("Erreur lors de la création du rendez-vous");
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
