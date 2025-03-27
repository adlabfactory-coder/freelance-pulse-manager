
import { useState, useEffect, useCallback } from "react";
import { contactService } from "@/services/contacts";
import { Contact } from "@/services/contacts/types";
import { ContactStatus } from "@/types/database/enums";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

export function useContactsData() {
  const { user, role, isAdminOrSuperAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | null>(null);
  const [includeTrash, setIncludeTrash] = useState(false);
  
  const fetchContacts = useCallback(async (showTrash: boolean = false) => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log("Récupération des contacts avec:", { 
        userId: user.id, 
        role, 
        isAdmin: isAdminOrSuperAdmin,
        includeTrash: showTrash
      });
      
      const data = await contactService.getContacts(user.id, role, showTrash);
      console.log("Contacts récupérés:", data.length);
      setContacts(data);
      
      if (data.length === 0) {
        console.log("Aucun contact n'a été trouvé dans la base de données");
      }
    } catch (error: any) {
      console.error("Erreur lors de la récupération des contacts:", error);
      setError(error.message || "Impossible de charger les contacts");
      toast.error("Erreur", {
        description: "Impossible de charger les contacts. Veuillez réessayer plus tard."
      });
    } finally {
      setLoading(false);
    }
  }, [user, role, isAdminOrSuperAdmin]);
  
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
    
    // Filtrer les contacts dans le dossier trash si includeTrash est false
    if (!includeTrash && contact.folder === 'trash') {
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
  
  const toggleTrashContacts = useCallback(() => {
    setIncludeTrash(prevState => !prevState);
    console.log("Toggling trash contacts, new value will be:", !includeTrash);
  }, [includeTrash]);
  
  useEffect(() => {
    if (user) {
      console.log("Fetching contacts with includeTrash:", includeTrash);
      fetchContacts(includeTrash);
    }
  }, [user, fetchContacts, includeTrash]);

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
          fetchContacts(includeTrash);
        }
      )
      .subscribe();
      
    return () => {
      console.log("Nettoyage de l'écouteur Supabase pour contacts");
      supabase.removeChannel(channel);
    };
  }, [user, fetchContacts, includeTrash]);

  return {
    contacts,
    filteredContacts,
    loading,
    error,
    searchTerm,
    statusFilter,
    includeTrash,
    fetchContacts,
    handleSearch,
    handleFilterByStatus,
    toggleTrashContacts,
    setContacts
  };
}
