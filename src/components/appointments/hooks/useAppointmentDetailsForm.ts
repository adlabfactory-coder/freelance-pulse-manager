
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

// Types d'options pour les titres de rendez-vous
export type AppointmentTitleOption = "consultation-initiale" | "session-suivi" | "demo-produit" | "revision-contrat" | "autre" | "";

// Définition des options de titre pour les rendez-vous
export const APPOINTMENT_TITLE_OPTIONS = [
  { value: "consultation-initiale", label: "Consultation initiale" },
  { value: "session-suivi", label: "Session de suivi" },
  { value: "demo-produit", label: "Démonstration de produit" },
  { value: "revision-contrat", label: "Révision de contrat" },
  { value: "autre", label: "Autre (personnalisé)" }
];

export const useAppointmentDetailsForm = () => {
  const [titleOption, setTitleOption] = useState<string>("consultation-initiale");
  const [customTitle, setCustomTitle] = useState("");
  const [appointmentDescription, setAppointmentDescription] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("09:00");
  const [appointmentDuration, setAppointmentDuration] = useState("60");
  const [contactId, setContactId] = useState("");
  const [contacts, setContacts] = useState<{id: string, name: string}[]>([]);

  // Charger les contacts au chargement du hook
  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, name')
        .is('deleted_at', null);
        
      if (!error && data) {
        setContacts(data);
      }
    };
    
    fetchContacts();
  }, []);

  return {
    titleOption,
    setTitleOption,
    customTitle,
    setCustomTitle,
    appointmentDescription,
    setAppointmentDescription,
    appointmentTime,
    setAppointmentTime,
    appointmentDuration,
    setAppointmentDuration,
    contactId,
    setContactId,
    contacts,
    APPOINTMENT_TITLE_OPTIONS
  };
};
