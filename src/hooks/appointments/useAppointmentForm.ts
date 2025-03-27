
import { useState, useEffect } from "react";
import { useAppointmentOperations } from "./useAppointmentOperations";
import { useAppointmentContacts } from "./useAppointmentContacts";
import { useAppointmentFreelancers } from "./useAppointmentFreelancers";
import { AppointmentTitleOption } from "@/types/appointment";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { toast } from "sonner";

// Export les options de titre pour réutilisation dans d'autres composants
export const APPOINTMENT_TITLE_OPTIONS = [
  { value: "consultation-initiale", label: "Consultation initiale" },
  { value: "session-suivi", label: "Session de suivi" },
  { value: "demo-produit", label: "Démonstration de produit" },
  { value: "revision-contrat", label: "Révision de contrat" },
  { value: "autre", label: "Titre personnalisé" }
];

export { type AppointmentTitleOption };

export const useAppointmentForm = (
  initialDate?: Date,
  onSuccess?: () => void,
  initialContactId?: string,
  autoAssign = false,
  initialFolder: string = "general"
) => {
  const { user } = useAuth();
  // États du formulaire pour les données de base
  const [titleOption, setTitleOption] = useState<AppointmentTitleOption>('consultation-initiale');
  const [customTitle, setCustomTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(30);
  const [folder, setFolder] = useState(initialFolder);
  
  // Utiliser les hooks spécialisés
  const { contacts, contactId, setContactId, isLoadingContacts } = useAppointmentContacts(initialContactId);
  const { defaultFreelancer, isLoadingFreelancer, isUserFreelancer } = useAppointmentFreelancers();
  const { isSubmitting, submitAppointment } = useAppointmentOperations();
  
  // Réinitialiser le formulaire lorsque la date initiale change
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);
  
  // Si un contactId initial est fourni, l'utiliser
  useEffect(() => {
    if (initialContactId) {
      setContactId(initialContactId);
    }
  }, [initialContactId, setContactId]);
  
  // Détermine le titre final à partir de l'option sélectionnée
  const getFinalTitle = (): string => {
    const titleOptions = {
      "consultation-initiale": "Consultation initiale",
      "session-suivi": "Session de suivi",
      "demo-produit": "Démonstration de produit",
      "revision-contrat": "Révision de contrat",
      "autre": customTitle || "Titre personnalisé"
    };
    
    return titleOption === 'autre' ? customTitle : titleOptions[titleOption as keyof typeof titleOptions];
  };
  
  const handleSubmit = async (e: React.FormEvent, overrideContactId?: string) => {
    e.preventDefault();
    
    const finalContactId = overrideContactId || contactId;
    if (!finalContactId) {
      toast.error("Veuillez sélectionner un contact");
      return null;
    }
    
    const finalTitle = getFinalTitle();
    
    // Logique de détermination du freelancer
    // Si l'utilisateur est un freelancer, toujours utiliser son propre ID
    let assignedFreelancerId = isUserFreelancer ? user?.id : defaultFreelancer;
    
    // Vérification que le freelancer est bien assigné
    if (!assignedFreelancerId) {
      toast.error("Un freelancer doit être assigné au rendez-vous");
      return null;
    }
    
    console.log("useAppointmentForm: Soumission du formulaire", {
      title: finalTitle, 
      contactId: finalContactId,
      freelancerId: assignedFreelancerId,
      autoAssign,
      userRole: user?.role
    });
    
    try {
      const result = await submitAppointment({
        title: finalTitle,
        description,
        date,
        time,
        duration,
        contactId: finalContactId,
        freelancerId: assignedFreelancerId,
        folder,
        // Désactiver l'auto-assignation car un freelancer doit être assigné
        autoAssign: false
      });
      
      if (result && onSuccess) {
        onSuccess();
      }
      
      return result;
    } catch (error) {
      console.error("Erreur dans handleSubmit:", error);
      return null;
    }
  };

  return {
    // Données du formulaire
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
    folder,
    setFolder,
    
    // États et données
    contacts,
    contactId,
    setContactId,
    isSubmitting,
    defaultFreelancer,
    isLoadingFreelancer,
    
    // Actions
    handleSubmit,
    
    // Constantes
    APPOINTMENT_TITLE_OPTIONS
  };
};
