
import React from "react";
import { useQuotesViewer } from "./hooks/useQuotesViewer";
import QuoteFilterBar from "./QuoteFilterBar";
import QuotesTable from "./QuotesTable";

interface QuoteViewerProps {
  title?: string;
  initialFilters?: {
    status?: string | null;
    folder?: string | null;
  };
}

const QuoteViewer: React.FC<QuoteViewerProps> = ({ 
  title = "Liste des devis",
  initialFilters = {}
}) => {
  const {
    quotes,
    loading,
    error,
    filters,
    sortColumn,
    sortDirection,
    contactOptions,
    freelancerOptions,
    contactsMap,
    freelancersMap,
    editingQuoteId,
    previewQuoteId,
    handleSort,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
    getContactName,
    getFreelancerFullName,
    formatReference,
    loadQuotes,
    setEditingQuoteId,
    setPreviewQuoteId,
    getQuoteById,
    getQuoteItems
  } = useQuotesViewer(initialFilters);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      
      <QuoteFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onResetFilters={resetFilters}
        freelancerOptions={freelancerOptions}
        contactOptions={contactOptions}
      />

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md">
          {error}
        </div>
      )}

      <QuotesTable
        quotes={quotes}
        loading={loading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        editingQuoteId={editingQuoteId}
        previewQuoteId={previewQuoteId}
        contactsMap={contactsMap}
        freelancersMap={freelancersMap}
        onSort={handleSort}
        onEditClick={setEditingQuoteId}
        onPreviewClick={setPreviewQuoteId}
        onEditComplete={loadQuotes}
        getContactName={getContactName}
        getFreelancerFullName={getFreelancerFullName}
        formatReference={formatReference}
        getQuoteById={getQuoteById}
        getQuoteItems={getQuoteItems}
      />
    </div>
  );
};

export default QuoteViewer;
