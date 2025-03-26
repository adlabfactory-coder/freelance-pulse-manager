
import { useState, useEffect, useCallback } from "react";
import { contactService } from "@/services/contacts";
import { Contact } from "@/services/contacts/types";
import { ContactStatus } from "@/types/database/enums";

export function useContactsData(isAdmin: boolean, isFreelancer: boolean, isAccountManager: boolean) {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  
  const fetchContacts = useCallback(async () => {
    if (!isAdmin && !isFreelancer && !isAccountManager) return;
    
    setLoading(true);
    const data = await contactService.getContacts();
    setContacts(data);
    setLoading(false);
  }, [isAdmin, isFreelancer, isAccountManager]);
  
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
    if ((isAdmin || isFreelancer || isAccountManager) && loadAttempt === 0) {
      console.log("Chargement initial des contacts");
      fetchContacts();
      setLoadAttempt(1);
    }
  }, [isAdmin, isFreelancer, isAccountManager, loadAttempt, fetchContacts]);

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
