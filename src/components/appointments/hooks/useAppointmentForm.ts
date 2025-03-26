
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; 
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

export const useAppointmentForm = (
  selectedDate?: Date | undefined, 
  onClose?: () => void,
  contactId?: string
) => {
  // États du formulaire
  const [titleOption, setTitleOption] = useState("consultation-initiale");
  const [customTitle, setCustomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(selectedDate || new Date());
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState("60");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();

  // Mise à jour de la date quand selectedDate change
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);

  // Fonction de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const title = titleOption === "autre" ? customTitle : 
      APPOINTMENT_TITLE_OPTIONS.find(option => option.value === titleOption)?.label || "";
    
    if (!date || !title) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Vérifier que l'utilisateur est connecté
      if (!user || !user.id) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        return;
      }
      
      // S'assurer qu'un ID de contact valide est disponible
      if (!contactId) {
        console.error("ID de contact manquant pour la création du rendez-vous");
        toast.error("Le contact pour ce rendez-vous n'est pas spécifié");
        return;
      }
      
      // Créer le format de date pour la base de données
      // Nous utilisons une nouvelle instance de Date pour éviter les problèmes de référence
      const dateObj = new Date(date.getTime());
      const [hours, minutes] = time.split(':').map(Number);
      
      dateObj.setHours(hours, minutes, 0, 0);
      
      // Vérifier que la date est valide
      if (isNaN(dateObj.getTime())) {
        toast.error("La date ou l'heure spécifiée n'est pas valide");
        return;
      }
      
      // Créer un rendez-vous
      const appointmentData = {
        title,
        description,
        date: dateObj.toISOString(),
        duration: parseInt(duration),
        status: "scheduled" as const,
        freelancerId: user.id,
        contactId: contactId,
        location: null,
        notes: null
      };
      
      console.log("Création d'un rendez-vous avec les données:", appointmentData);
      
      // Appel du service avec les données préparées
      const result = await appointmentService.createAppointment(appointmentData);
      
      if (!result) {
        throw new Error("Erreur lors de la création du rendez-vous");
      }
      
      // Message de succès
      toast.success(`${title} planifié le ${format(dateObj, "dd/MM/yyyy à HH:mm", { locale: fr })}`);
      
      // Réinitialiser le formulaire et fermer la boîte de dialogue
      resetForm();
      if (onClose) onClose();
      
      // Attendre un court instant avant de déclencher un événement personnalisé
      // pour rafraîchir les notifications
      setTimeout(() => {
        const event = new CustomEvent('appointment-created');
        window.dispatchEvent(event);
      }, 500);
      
    } catch (error: any) {
      console.error("Erreur lors de la planification du rendez-vous:", error);
      toast.error(error.message || "Une erreur est survenue lors de la planification du rendez-vous.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setTitleOption("consultation-initiale");
    setCustomTitle("");
    setDescription("");
    setDate(new Date());
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
