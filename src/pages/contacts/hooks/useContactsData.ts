
import { useState, useEffect, useCallback } from "react";
import { contactService } from "@/services/contacts";
import { Contact } from "@/services/contacts/types";
import { ContactStatus } from "@/types/database/enums";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

export function useContactsData() {
  const { user, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | null>(null);
  
  const fetchContacts = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Récupération des contacts avec:", { userId: user.id, role });
      const data = await contactService.getContacts(user.id, role);
      console.log("Contacts récupérés:", data.length);
      setContacts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
      toast.error("Impossible de charger les contacts");
    } finally {
      setLoading(false);
    }
  }, [user, role]);
  
  // Filtrage des contacts
  const filteredContacts = contacts.filter(contact => {
    // Filtrer par terme de recherche
    if (searchTerm && !contact.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtrer par statut
    if (statusFilter && contact.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFilterByStatus = useCallback((status: ContactStatus | null) => {
    setStatusFilter(status);
  }, []);
  
  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user, fetchContacts]);

  // Écouteur en temps réel
  useEffect(() => {
    if (!user) return;
    
    console.log("Configuration de l'écouteur Supabase pour contacts");
    const channel = supabase
      .channel('public:contacts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contacts' }, 
        () => {
          console.log("Changement détecté dans la table contacts");
          fetchContacts();
        }
      )
      .subscribe();
      
    return () => {
      console.log("Nettoyage de l'écouteur Supabase pour contacts");
      supabase.removeChannel(channel);
    };
  }, [user, fetchContacts]);

  return {
    contacts,
    filteredContacts,
    loading,
    searchTerm,
    statusFilter,
    fetchContacts,
    handleSearch,
    handleFilterByStatus,
    setContacts
  };
}
