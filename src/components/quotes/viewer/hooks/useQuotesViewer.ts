
import { useState, useEffect, useMemo } from "react";
import { fetchQuotes } from "@/services/quote-service";
import { Quote, QuoteStatus } from "@/types/quote";
import { QuoteFilters } from "../QuoteFilterBar";
import { contactService } from "@/services/contact-service";
import { fetchUserById } from "@/services/user-service";
import { Contact } from "@/services/contacts/types";
import { User } from "@/types";
import { toast } from "sonner";

const defaultFilters: QuoteFilters = {
  search: "",
  status: null,
  dateFrom: null,
  dateTo: null,
  freelancerId: null,
  contactId: null,
  minAmount: null,
  maxAmount: null,
  folder: null // Add folder property to the QuoteFilters
};

export const useQuotesViewer = (initialFilters?: Partial<QuoteFilters>) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QuoteFilters>({
    ...defaultFilters,
    ...initialFilters
  });
  const [sortColumn, setSortColumn] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [contactsMap, setContactsMap] = useState<Record<string, Contact>>({});
  const [freelancersMap, setFreelancersMap] = useState<Record<string, User>>({});
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  // Charger les devis
  const loadQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuotes();
      setQuotes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des devis:", error);
      setError("Impossible de charger les devis. Veuillez réessayer plus tard.");
      toast.error("Erreur lors du chargement des devis");
    } finally {
      setLoading(false);
    }
  };

  // Charger les contacts et les commerciaux
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les contacts - Change getAllContacts to getContacts
        const contactsList = await contactService.getContacts();
        setContacts(contactsList);
        
        const contactsMapObj: Record<string, Contact> = {};
        contactsList.forEach(contact => {
          contactsMapObj[contact.id] = contact;
        });
        setContactsMap(contactsMapObj);
        
        // Extraction des IDs de freelancers uniques des devis
        const freelancerIds = Array.from(new Set(quotes.map(quote => quote.freelancerId)));
        
        // Charger les données des freelancers
        const freelancersData: User[] = [];
        const freelancersMapObj: Record<string, User> = {};
        
        for (const id of freelancerIds) {
          try {
            const freelancer = await fetchUserById(id);
            if (freelancer) {
              freelancersData.push(freelancer);
              freelancersMapObj[id] = freelancer;
            }
          } catch (err) {
            console.error(`Erreur lors du chargement du commercial ${id}:`, err);
          }
        }
        
        setFreelancers(freelancersData);
        setFreelancersMap(freelancersMapObj);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données");
      }
    };

    if (quotes.length > 0) {
      loadData();
    }
  }, [quotes]);

  // Charger les devis au montage
  useEffect(() => {
    loadQuotes();
  }, []);

  // Filtrage des devis
  const filteredQuotes = useMemo(() => {
    return quotes.filter(quote => {
      // Filtrer par terme de recherche (dans référence, contact ou commercial)
      const searchMatch = !filters.search || 
        quote.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        getContactName(quote.contactId).toLowerCase().includes(filters.search.toLowerCase()) ||
        getFreelancerFullName(quote.freelancerId).toLowerCase().includes(filters.search.toLowerCase()) ||
        (quote.status && quote.status.toLowerCase().includes(filters.search.toLowerCase()));
      
      // Filtrer par statut
      const statusMatch = !filters.status || quote.status === filters.status;
      
      // Filtrer par date (validUntil)
      const dateFromMatch = !filters.dateFrom || new Date(quote.validUntil) >= filters.dateFrom;
      const dateToMatch = !filters.dateTo || new Date(quote.validUntil) <= filters.dateTo;
      
      // Filtrer par commercial
      const freelancerMatch = !filters.freelancerId || quote.freelancerId === filters.freelancerId;
      
      // Filtrer par contact
      const contactMatch = !filters.contactId || quote.contactId === filters.contactId;
      
      // Filtrer par montant
      const minAmountMatch = !filters.minAmount || quote.totalAmount >= filters.minAmount;
      const maxAmountMatch = !filters.maxAmount || quote.totalAmount <= filters.maxAmount;
      
      // Filtrer par dossier
      const folderMatch = !filters.folder || quote.folder === filters.folder;
      
      return searchMatch && statusMatch && dateFromMatch && dateToMatch && 
             freelancerMatch && contactMatch && minAmountMatch && maxAmountMatch && folderMatch;
    });
  }, [quotes, filters]);

  // Tri des devis
  const sortedQuotes = useMemo(() => {
    return [...filteredQuotes].sort((a, b) => {
      if (sortColumn === "totalAmount") {
        return sortDirection === "asc"
          ? a.totalAmount - b.totalAmount
          : b.totalAmount - a.totalAmount;
      } else if (sortColumn === "validUntil") {
        return sortDirection === "asc"
          ? new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
          : new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime();
      } else if (sortColumn === "updatedAt") {
        return sortDirection === "asc"
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });
  }, [filteredQuotes, sortColumn, sortDirection]);

  // Gestion du tri
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Gestion des filtres
  const handleFilterChange = (newFilters: QuoteFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Fonctions utilitaires
  const getContactName = (contactId: string): string => {
    return contactsMap[contactId]?.name || 'Contact inconnu';
  };

  const getFreelancerFullName = (freelancerId: string): string => {
    const freelancer = freelancersMap[freelancerId];
    return freelancer?.name || 'Commercial inconnu';
  };

  const formatReference = (id: string): string => {
    return `DEV-${id.substring(0, 8).toUpperCase()}`;
  };

  // Options pour les filtres
  const contactOptions = contacts.map(contact => ({
    id: contact.id,
    name: contact.name
  }));

  const freelancerOptions = freelancers.map(freelancer => ({
    id: freelancer.id,
    name: freelancer.name
  }));

  return {
    quotes: filteredQuotes,
    loading,
    error,
    filters,
    sortColumn,
    sortDirection,
    contacts,
    freelancers,
    contactsMap,
    freelancersMap,
    editingQuoteId,
    contactOptions,
    freelancerOptions,
    loadQuotes,
    handleSort,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
    getContactName,
    getFreelancerFullName,
    formatReference,
    setEditingQuoteId
  };
};
