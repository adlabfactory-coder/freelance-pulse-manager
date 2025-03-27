
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { formatDateForAPI } from "@/utils/format";
import { AppointmentStatus } from "@/types/appointment";
import { createAppointment } from "@/services/appointments/create";
import { useAppointmentDetailsForm } from "./useAppointmentDetailsForm";

export const useSchedulePlanner = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    titleOption, 
    customTitle, 
    appointmentDescription, 
    appointmentTime, 
    appointmentDuration, 
    contactId,
    APPOINTMENT_TITLE_OPTIONS
  } = useAppointmentDetailsForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const title = titleOption === "autre" ? customTitle : 
      APPOINTMENT_TITLE_OPTIONS.find(option => option.value === titleOption)?.label || "";
    
    if (!selectedDate || !title || !contactId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Créer le format de date pour la base de données
      const appointmentDate = formatDateForAPI(selectedDate, appointmentTime);
      
      if (!appointmentDate) {
        toast.error("Format de date ou d'heure invalide");
        return;
      }
      
      // Utiliser le service de création de rendez-vous
      const result = await createAppointment({
        title,
        description: appointmentDescription,
        date: appointmentDate,
        duration: parseInt(appointmentDuration, 10),
        status: AppointmentStatus.SCHEDULED,
        contactId: contactId, // Changed from contact_id to contactId
        freelancerId: user?.role === 'freelancer' ? user.id : undefined, // Changed from freelancer_id to freelancerId
        folder: 'general'
      });
      
      if (result) {
        toast.success("Rendez-vous planifié avec succès");
        
        // Déclencher l'événement de création de rendez-vous
        window.dispatchEvent(new CustomEvent('appointment-created'));
      }
    } catch (error) {
      console.error("Erreur lors de la planification du rendez-vous:", error);
      toast.error("Une erreur est survenue lors de la planification du rendez-vous");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    handleSubmit,
    isSubmitting
  };
};
