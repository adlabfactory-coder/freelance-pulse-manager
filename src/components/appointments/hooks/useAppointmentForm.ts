
import { useState } from "react";
import { createAppointment, createAutoAssignAppointment } from "@/services/appointments/create";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "@/types/appointment";

// Export the title options for reuse in other components
export const APPOINTMENT_TITLE_OPTIONS = [
  { value: "consultation-initiale", label: "Consultation initiale" },
  { value: "session-suivi", label: "Session de suivi" },
  { value: "demo-produit", label: "Démonstration de produit" },
  { value: "revision-contrat", label: "Révision de contrat" },
  { value: "autre", label: "Titre personnalisé" }
];

export type AppointmentTitleOption = "consultation-initiale" | "session-suivi" | "demo-produit" | "revision-contrat" | "autre" | "";

export const useAppointmentForm = (
  initialDate?: Date,
  onSuccess?: () => void,
  initialContactId?: string,
  autoAssign = false
) => {
  // États du formulaire
  const [titleOption, setTitleOption] = useState<AppointmentTitleOption>('consultation-initiale');
  const [customTitle, setCustomTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [time, setTime] = useState('10:00'); // Heure par défaut
  const [duration, setDuration] = useState(30); // Minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent, contactId: string) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("Veuillez sélectionner une date valide");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Construire la date avec l'heure
      const [hours, minutes] = time.split(':').map(Number);
      const appointmentDate = new Date(date);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // Déterminer le titre final
      const titleOptions = {
        "consultation-initiale": "Consultation initiale",
        "session-suivi": "Session de suivi",
        "demo-produit": "Démonstration de produit",
        "revision-contrat": "Révision de contrat",
        "autre": "Titre personnalisé"
      };
      
      const title = titleOption === 'autre' ? customTitle : titleOptions[titleOption as keyof typeof titleOptions];
      
      // Créer l'objet de rendez-vous à envoyer
      const appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        description,
        date: appointmentDate.toISOString(),
        duration,
        status: AppointmentStatus.SCHEDULED,
        contactId,
        freelancerId: "", // Corrected from freelancerid to freelancerId
        location: null,
        notes: null
      };
      
      let result;
      if (autoAssign) {
        // Créer un rendez-vous auto-assigné
        result = await createAutoAssignAppointment(appointmentData);
      } else {
        // Créer un rendez-vous standard
        result = await createAppointment(appointmentData);
      }
      
      if (result) {
        // Déclencher l'événement de création de rendez-vous pour rafraîchir les données
        window.dispatchEvent(new CustomEvent('appointment-created'));
        
        // Appeler le callback de succès si fourni
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la création du rendez-vous:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    titleOption,
    setTitleOption,
    customTitle,
    setCustomTitle,
    description,
    setDescription,
    date,
    setDate,
    time,
    setTime,
    duration,
    setDuration,
    isSubmitting,
    handleSubmit
  };
};
