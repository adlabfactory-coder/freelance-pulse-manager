
import { useState, useMemo } from "react";
import { Quote, QuoteStatus } from "@/types/quote";

export interface QuoteFilters {
  search: string;
  status: QuoteStatus | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  freelancerId: string | null;
  contactId: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  folder: string | null;
}

const defaultFilters: QuoteFilters = {
  search: "",
  status: null,
  dateFrom: null,
  dateTo: null,
  freelancerId: null,
  contactId: null,
  minAmount: null,
  maxAmount: null,
  folder: null
};

export const useQuotesFiltering = (
  quotes: Quote[],
  initialFilters?: Partial<QuoteFilters>,
  getContactName: (contactId: string) => string,
  getFreelancerFullName: (freelancerId: string) => string
) => {
  const [filters, setFilters] = useState<QuoteFilters>({
    ...defaultFilters,
    ...initialFilters
  });

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
  }, [quotes, filters, getContactName, getFreelancerFullName]);

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

  return {
    filters,
    filteredQuotes,
    handleFilterChange,
    handleSearchChange,
    resetFilters
  };
};
