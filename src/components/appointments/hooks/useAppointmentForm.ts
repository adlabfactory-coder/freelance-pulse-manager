
import { useState, useEffect } from "react";
import { createAppointment, createAutoAssignAppointment } from "@/services/appointments/create";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { formatDateForAPI } from "@/utils/format";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase-client";

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
  autoAssign = false,
  initialFolder: string = "general"
) => {
  const { user } = useAuth();
  // États du formulaire
  const [titleOption, setTitleOption] = useState<AppointmentTitleOption>('consultation-initiale');
  const [customTitle, setCustomTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [time, setTime] = useState('10:00'); // Heure par défaut
  const [duration, setDuration] = useState(30); // Minutes
  const [folder, setFolder] = useState(initialFolder);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultFreelancer, setDefaultFreelancer] = useState<string | null>(null);
  
  // Récupérer un freelancer par défaut dès le chargement du formulaire
  useEffect(() => {
    const fetchDefaultFreelancer = async () => {
      if (user?.role === 'freelancer') {
        // Si l'utilisateur est un freelancer, utiliser son ID
        setDefaultFreelancer(user.id);
        console.log("Utilisateur freelancer trouvé, ID utilisé:", user.id);
      } else {
        // Sinon, récupérer un freelancer par défaut
        try {
          console.log("Recherche d'un freelancer par défaut...");
          const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('role', 'freelancer')
            .limit(1)
            .single();
            
          if (!error && data) {
            console.log("Freelancer par défaut trouvé:", data.id);
            setDefaultFreelancer(data.id);
          } else {
            console.warn("Aucun freelancer trouvé pour l'assignation par défaut:", error);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération d'un freelancer par défaut:", error);
        }
      }
    };
    
    fetchDefaultFreelancer();
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent, contactId: string) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("Veuillez sélectionner une date valide");
      return;
    }
    
    if (!contactId) {
      toast.error("Veuillez sélectionner un contact pour ce rendez-vous");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Début de la soumission du rendez-vous...");
      
      // Utiliser la fonction formatDateForAPI pour obtenir une date ISO valide
      const appointmentDate = formatDateForAPI(date, time);
      
      if (!appointmentDate) {
        toast.error("Format de date ou d'heure invalide");
        setIsSubmitting(false);
        return;
      }
      
      // Déterminer le titre final
      const titleOptions = {
        "consultation-initiale": "Consultation initiale",
        "session-suivi": "Session de suivi",
        "demo-produit": "Démonstration de produit",
        "revision-contrat": "Révision de contrat",
        "autre": customTitle || "Titre personnalisé"
      };
      
      const title = titleOption === 'autre' ? customTitle : titleOptions[titleOption as keyof typeof titleOptions];
      
      // Déterminer le freelancer - Utiliser l'ID utilisateur connecté s'il est freelancer
      const isUserFreelancer = user?.role === 'freelancer';
      const freelancerId = isUserFreelancer ? user?.id : defaultFreelancer;
      
      console.log("Informations du rendez-vous:", {
        title,
        contactId,
        freelancerId,
        appointmentDate,
        autoAssign
      });
      
      // Vérifier si un freelancer est disponible
      if (!freelancerId && !autoAssign) {
        toast.error("Aucun freelancer disponible pour l'assignation. Veuillez contacter l'administrateur.");
        setIsSubmitting(false);
        return;
      }
      
      // Créer l'objet de rendez-vous à envoyer
      const appointmentData = {
        title,
        description,
        date: appointmentDate,
        duration,
        status: autoAssign ? AppointmentStatus.PENDING : AppointmentStatus.SCHEDULED,
        contactId,
        // Assurer que freelancerId est toujours présent, même en mode auto-assigné
        freelancerId: freelancerId || defaultFreelancer || '',
        location: null,
        notes: null,
        folder: folder,
        currentUserId: user?.id // Ajouter l'ID de l'utilisateur actuel comme fallback
      };
      
      console.log("Soumission des données de rendez-vous:", appointmentData);
      
      let result;
      if (autoAssign) {
        // Créer un rendez-vous auto-assigné
        result = await createAutoAssignAppointment(appointmentData);
      } else {
        // Créer un rendez-vous standard
        result = await createAppointment(appointmentData);
      }
      
      if (result) {
        console.log("Rendez-vous créé avec succès:", result);
        // Déclencher l'événement de création de rendez-vous pour rafraîchir les données
        window.dispatchEvent(new CustomEvent('appointment-created'));
        
        // Appeler le callback de succès si fourni
        if (onSuccess) onSuccess();
        
        toast.success("Rendez-vous créé avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      toast.error("Impossible de créer le rendez-vous. Veuillez réessayer.");
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
    folder,
    setFolder,
    isSubmitting,
    handleSubmit,
    defaultFreelancer
  };
};
