
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
  const [isLoadingFreelancer, setIsLoadingFreelancer] = useState(true);
  
  // Récupérer un freelancer par défaut dès le chargement du formulaire
  useEffect(() => {
    const fetchDefaultFreelancer = async () => {
      console.log("useAppointmentForm: Recherche d'un freelancer par défaut");
      setIsLoadingFreelancer(true);
      
      try {
        if (user?.role === 'freelancer') {
          // Si l'utilisateur est un freelancer, utiliser son ID
          setDefaultFreelancer(user.id);
          console.log("useAppointmentForm: Utilisateur freelancer trouvé, ID utilisé:", user.id);
        } else {
          // Sinon, récupérer un freelancer par défaut
          console.log("useAppointmentForm: Recherche d'un freelancer par défaut dans la base de données");
          const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('role', 'freelancer')
            .limit(1);
            
          if (!error && data && data.length > 0) {
            console.log("useAppointmentForm: Freelancer par défaut trouvé:", data[0].id);
            setDefaultFreelancer(data[0].id);
          } else {
            console.warn("useAppointmentForm: Aucun freelancer trouvé pour l'assignation par défaut:", error);
            toast.warning("Aucun freelancer disponible. Mode auto-assignation activé.");
          }
        }
      } catch (error) {
        console.error("useAppointmentForm: Erreur lors de la récupération d'un freelancer par défaut:", error);
        toast.error("Erreur lors de la recherche d'un freelancer disponible.");
      } finally {
        setIsLoadingFreelancer(false);
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
      console.log("useAppointmentForm: Début de la soumission du rendez-vous...");
      
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
      
      console.log("useAppointmentForm: Informations du rendez-vous:", {
        title,
        contactId,
        freelancerId,
        appointmentDate,
        autoAssign
      });
      
      // Vérifier si un freelancer est disponible
      if (!freelancerId && !autoAssign) {
        console.log("useAppointmentForm: Aucun freelancer disponible, passage en mode auto-assignation");
        toast.info("Aucun freelancer disponible, le rendez-vous sera auto-assigné");
      }
      
      // Créer l'objet de rendez-vous à envoyer
      const appointmentData = {
        title,
        description,
        date: appointmentDate,
        duration,
        status: (!freelancerId || autoAssign) ? AppointmentStatus.PENDING : AppointmentStatus.SCHEDULED,
        contactId,
        // Assurer que freelancerId est toujours présent, même en mode auto-assigné
        freelancerId: freelancerId || '',
        location: null,
        notes: null,
        folder: folder,
        currentUserId: user?.id // Ajouter l'ID de l'utilisateur actuel comme fallback
      };
      
      console.log("useAppointmentForm: Soumission des données de rendez-vous:", appointmentData);
      
      let result;
      if (!freelancerId || autoAssign) {
        // Créer un rendez-vous auto-assigné
        console.log("useAppointmentForm: Création d'un rendez-vous auto-assigné");
        result = await createAutoAssignAppointment(appointmentData);
      } else {
        // Créer un rendez-vous standard
        console.log("useAppointmentForm: Création d'un rendez-vous standard");
        result = await createAppointment(appointmentData);
      }
      
      if (result) {
        console.log("useAppointmentForm: Rendez-vous créé avec succès:", result);
        // Déclencher l'événement de création de rendez-vous pour rafraîchir les données
        window.dispatchEvent(new CustomEvent('appointment-created'));
        
        // Appeler le callback de succès si fourni
        if (onSuccess) onSuccess();
        
        toast.success("Rendez-vous créé avec succès");
      }
    } catch (error) {
      console.error("useAppointmentForm: Erreur lors de la création du rendez-vous:", error);
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
    defaultFreelancer,
    isLoadingFreelancer
  };
};
