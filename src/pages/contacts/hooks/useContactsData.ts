
import { useState, useEffect, useCallback } from "react";
import { contactService } from "@/services/contacts";
import { Contact } from "@/services/contacts/types";
import { ContactStatus } from "@/types/database/enums";
import { useAuth } from "@/hooks/use-auth";

export function useContactsData() {
  const { isAdmin, isFreelancer, isAccountManager, user, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  
  const fetchContacts = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    // Passer l'ID de l'utilisateur et son rôle pour filtrer les contacts selon le rôle
    const data = await contactService.getContacts(user.id, role);
    setContacts(data);
    setLoading(false);
  }, [user, role]);
  
  // Filter contacts based on search term and status
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
    if (user && loadAttempt === 0) {
      console.log("Chargement initial des contacts");
      fetchContacts();
      setLoadAttempt(1);
    }
  }, [user, loadAttempt, fetchContacts]);

  // Mettre en place l'écouteur pour les mises à jour en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('public:contacts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contacts' }, 
        () => fetchContacts()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchContacts]);

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

// Ajouter l'import manquant
import { supabase } from "@/lib/supabase";
