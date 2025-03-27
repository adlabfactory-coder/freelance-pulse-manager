
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

export const useAppointmentContacts = (initialContactId?: string) => {
  const [contacts, setContacts] = useState<Array<{ id: string; name: string }>>([]);
  const [contactId, setContactId] = useState<string>(initialContactId || "");
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      console.log("useAppointmentContacts: Chargement des contacts");
      setIsLoadingContacts(true);
      
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('id, name')
          .is('deleted_at', null)
          .order('name');
          
        if (!error && data) {
          console.log("useAppointmentContacts: Contacts chargés avec succès:", data.length);
          setContacts(data);
        } else {
          console.error("useAppointmentContacts: Erreur lors du chargement des contacts:", error);
          toast.error("Erreur lors du chargement des contacts");
        }
      } catch (error) {
        console.error("useAppointmentContacts: Erreur inattendue:", error);
        toast.error("Erreur inattendue lors du chargement des contacts");
      } finally {
        setIsLoadingContacts(false);
      }
    };
    
    fetchContacts();
  }, []);

  // Si un ID de contact initial est fourni, on l'utilise
  useEffect(() => {
    if (initialContactId) {
      setContactId(initialContactId);
    }
  }, [initialContactId]);

  return {
    contacts,
    contactId,
    setContactId,
    isLoadingContacts
  };
};
