
import React, { useState } from "react";
import { Table } from "@/components/ui/table";
import { Quote } from "@/types/quote";
import EditQuoteDialog from "../form/EditQuoteDialog";
import QuotePreviewDialog from "./QuotePreviewDialog";
import QuoteTableHead from "./table/QuoteTableHead";
import QuoteTableBody from "./table/QuoteTableBody";
import QuoteTableLoadingSkeleton from "./table/QuoteTableLoadingSkeleton";
import QuoteTableEmptyState from "./table/QuoteTableEmptyState";

interface QuotesTableProps {
  quotes: Quote[];
  loading: boolean;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  editingQuoteId: string | null;
  previewQuoteId: string | null;
  contactsMap: Record<string, any>;
  freelancersMap: Record<string, any>;
  selectedQuoteIds: string[];
  selectAll: boolean;
  onSort: (column: string) => void;
  onEditClick: (quoteId: string) => void;
  onPreviewClick: (quoteId: string) => void;
  onEditComplete: () => void;
  onSelectQuote: (quoteId: string) => void;
  onSelectAll: () => void;
  getContactName: (contactId: string) => string;
  getFreelancerFullName: (freelancerId: string) => string;
  formatReference: (id: string) => string;
  getQuoteById: (id: string | null) => Quote | null;
  getQuoteItems: (quoteId: string | null) => any[];
}

const QuotesTable: React.FC<QuotesTableProps> = ({
  quotes,
  loading,
  sortColumn,
  sortDirection,
  editingQuoteId,
  previewQuoteId,
  contactsMap,
  freelancersMap,
  selectedQuoteIds,
  selectAll,
  onSort,
  onEditClick,
  onPreviewClick,
  onEditComplete,
  onSelectQuote,
  onSelectAll,
  getContactName,
  getFreelancerFullName,
  formatReference,
  getQuoteById,
  getQuoteItems
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  // Quand l'aperçu s'ouvre, mettre à jour le préview ID
  const handlePreviewClick = (quoteId: string) => {
    onPreviewClick(quoteId);
    setPreviewOpen(true);
  };

  // Quand l'aperçu se ferme, réinitialiser le préview ID
  const handlePreviewOpenChange = (open: boolean) => {
    setPreviewOpen(open);
    if (!open) {
      onPreviewClick("");
    }
  };

  const previewQuote = getQuoteById(previewQuoteId);
  const previewItems = getQuoteItems(previewQuoteId);

  const handleRowClick = (e: React.MouseEvent, quoteId: string) => {
    // Vérifier si le clic vient d'un bouton ou une checkbox
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('[role="checkbox"]')) {
      return;
    }
    
    // Sinon gérer le clic sur la ligne comme une sélection
    onSelectQuote(quoteId);
  };

  if (loading) {
    return <QuoteTableLoadingSkeleton />;
  }

  if (quotes.length === 0) {
    return <QuoteTableEmptyState />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <QuoteTableHead
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          selectAll={selectAll}
          onSort={onSort}
          onSelectAll={onSelectAll}
        />
        <QuoteTableBody
          quotes={quotes}
          selectedQuoteIds={selectedQuoteIds}
          onRowClick={handleRowClick}
          onSelectQuote={onSelectQuote}
          onEditClick={onEditClick}
          onPreviewClick={handlePreviewClick}
          getContactName={getContactName}
          getFreelancerFullName={getFreelancerFullName}
          formatReference={formatReference}
        />
      </Table>

      {editingQuoteId && (
        <EditQuoteDialog
          quoteId={editingQuoteId}
          open={!!editingQuoteId}
          onOpenChange={(open) => {
            if (!open) onEditClick("");
          }}
          onQuoteUpdated={onEditComplete}
        />
      )}

      <QuotePreviewDialog
        quote={previewQuote}
        contactName={previewQuote ? getContactName(previewQuote.contactId) : ""}
        freelancerName={previewQuote ? getFreelancerFullName(previewQuote.freelancerId) : ""}
        items={previewItems}
        open={previewOpen}
        onOpenChange={handlePreviewOpenChange}
      />
    </div>
  );
};

export default QuotesTable;
