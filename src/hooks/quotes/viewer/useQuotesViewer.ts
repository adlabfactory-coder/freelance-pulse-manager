
import { useState } from "react";
import { useQuotesData } from "./useQuotesData";
import { useQuotesFiltering, QuoteFilters } from "./useQuotesFiltering";
import { useQuotesSorting } from "./useQuotesSorting";
import { useQuotesSelection } from "./useQuotesSelection";

export const useQuotesViewer = (initialFilters?: Partial<QuoteFilters>) => {
  // Charger les données des devis et informations associées
  const {
    quotes,
    loading,
    error,
    contacts,
    freelancers,
    contactsMap,
    freelancersMap,
    editingQuoteId,
    previewQuoteId,
    contactOptions,
    freelancerOptions,
    loadQuotes,
    getContactName,
    getFreelancerFullName,
    formatReference,
    setEditingQuoteId,
    setPreviewQuoteId,
    getQuoteById,
    getQuoteItems
  } = useQuotesData();

  // Gestion du filtrage
  const {
    filters,
    filteredQuotes,
    handleFilterChange,
    handleSearchChange,
    resetFilters
  } = useQuotesFiltering(quotes, initialFilters, getContactName, getFreelancerFullName);

  // Gestion du tri
  const {
    sortColumn,
    sortDirection,
    sortedQuotes,
    handleSort
  } = useQuotesSorting(filteredQuotes);

  // Gestion de la sélection
  const {
    selectedQuoteIds,
    selectAll,
    toggleSelectQuote,
    handleSelectAll,
    deleteSelectedQuotes
  } = useQuotesSelection(sortedQuotes, loadQuotes);

  return {
    quotes: sortedQuotes,
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
    previewQuoteId,
    contactOptions,
    freelancerOptions,
    selectedQuoteIds,
    selectAll,
    loadQuotes,
    handleSort,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
    getContactName,
    getFreelancerFullName,
    formatReference,
    setEditingQuoteId,
    setPreviewQuoteId,
    getQuoteById,
    getQuoteItems,
    toggleSelectQuote,
    handleSelectAll,
    deleteSelectedQuotes
  };
};
