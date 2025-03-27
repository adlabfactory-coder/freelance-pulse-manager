
import { useState, useEffect } from "react";
import { createAppointment, createAutoAssignAppointment, AppointmentCreateData } from "@/services/appointments/create";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { formatDateForAPI } from "@/utils/format";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase-client";

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
  
  const [titleOption, setTitleOption] = useState<AppointmentTitleOption>('consultation-initiale');
  const [customTitle, setCustomTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(30);
  const [folder, setFolder] = useState(initialFolder);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultFreelancer, setDefaultFreelancer] = useState<string | null>(null);
  const [isLoadingFreelancer, setIsLoadingFreelancer] = useState(true);
  
  useEffect(() => {
    const fetchDefaultFreelancer = async () => {
      console.log("useAppointmentForm: Recherche d'un freelancer par défaut");
      setIsLoadingFreelancer(true);
      
      try {
        if (user?.role === 'freelancer') {
          setDefaultFreelancer(user.id);
          console.log("useAppointmentForm: Utilisateur freelancer trouvé, ID utilisé:", user.id);
        } else {
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
      
      const appointmentDate = formatDateForAPI(date, time);
      
      if (!appointmentDate) {
        toast.error("Format de date ou d'heure invalide");
        setIsSubmitting(false);
        return;
      }
      
      const titleOptions = {
        "consultation-initiale": "Consultation initiale",
        "session-suivi": "Session de suivi",
        "demo-produit": "Démonstration de produit",
        "revision-contrat": "Révision de contrat",
        "autre": customTitle || "Titre personnalisé"
      };
      
      const title = titleOption === 'autre' ? customTitle : titleOptions[titleOption as keyof typeof titleOptions];
      
      const isUserFreelancer = user?.role === 'freelancer';
      const freelancerId = isUserFreelancer ? user?.id : defaultFreelancer;
      
      console.log("useAppointmentForm: Informations du rendez-vous:", {
        title,
        contactId,
        freelancerId,
        appointmentDate,
        autoAssign
      });
      
      if (!freelancerId && !autoAssign) {
        console.log("useAppointmentForm: Aucun freelancer disponible, passage en mode auto-assignation");
        toast.info("Aucun freelancer disponible, le rendez-vous sera auto-assigné");
      }
      
      const appointmentData: AppointmentCreateData = {
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
      
      console.log("useAppointmentForm: Soumission des données de rendez-vous:", appointmentData);
      
      let result;
      if (!freelancerId || autoAssign) {
        result = await createAutoAssignAppointment(appointmentData);
      } else {
        result = await createAppointment(appointmentData);
      }
      
      if (result) {
        console.log("useAppointmentForm: Rendez-vous créé avec succès:", result);
        window.dispatchEvent(new CustomEvent('appointment-created'));
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
