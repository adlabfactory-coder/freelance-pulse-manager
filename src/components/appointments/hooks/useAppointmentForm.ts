import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import * as appointmentService from "@/services/appointments";

// Options pour les types de rendez-vous
export const APPOINTMENT_TITLE_OPTIONS = [
  { value: "consultation-initiale", label: "Consultation initiale" },
  { value: "negociation-devis", label: "Négociation devis" },
  { value: "relance-paiement", label: "Relance de paiement" },
  { value: "autre", label: "Autre (personnalisé)" }
];

export type AppointmentFormData = {
  titleOption: string;
  customTitle: string;
  description: string;
  date: Date | undefined;
  time: string;
  duration: string;
};

export const useAppointmentForm = (selectedDate?: Date, onClose?: () => void) => {
  // États du formulaire
  const [titleOption, setTitleOption] = useState("consultation-initiale");
  const [customTitle, setCustomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(selectedDate || new Date());
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState("60");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();

  // Fonction de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const title = titleOption === "autre" ? customTitle : 
      APPOINTMENT_TITLE_OPTIONS.find(option => option.value === titleOption)?.label || "";
    
    if (!date || !title) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Créer le format de date pour la base de données
      const dateTimeString = format(date, "yyyy-MM-dd") + "T" + time;
      const appointmentDateTime = new Date(dateTimeString);
      
      // Créer un rendez-vous
      const appointmentData = {
        title,
        description,
        date: appointmentDateTime.toISOString(),
        duration: parseInt(duration),
        status: "scheduled" as const,
        freelancerId: user?.id || '',
        contactId: '00000000-0000-0000-0000-000000000000', // À remplacer par un vrai ID
        location: null,
        notes: null
      };
      
      // Appel du service avec les données préparées
      const result = await appointmentService.createAppointment(appointmentData);
      
      if (!result) {
        throw new Error("Erreur lors de la création du rendez-vous");
      }
      
      // Message de succès
      toast({
        title: "Rendez-vous planifié",
        description: `${title} planifié le ${format(appointmentDateTime, "dd/MM/yyyy à HH:mm", { locale: require("date-fns/locale/fr") })}`,
      });
      
      // Réinitialiser le formulaire et fermer la boîte de dialogue
      resetForm();
      if (onClose) onClose();
      
      // Attendre un court instant avant de déclencher un événement personnalisé
      // pour rafraîchir les notifications
      setTimeout(() => {
        const event = new CustomEvent('appointment-created');
        window.dispatchEvent(event);
      }, 500);
      
    } catch (error) {
      console.error("Erreur lors de la planification du rendez-vous:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la planification du rendez-vous.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setTitleOption("consultation-initiale");
    setCustomTitle("");
    setDescription("");
    setTime("09:00");
    setDuration("60");
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
