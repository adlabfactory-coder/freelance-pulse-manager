
import React, { useState } from "react";
import { useQuotesViewer } from "./hooks/useQuotesViewer";
import { QuoteFilters } from "./QuoteFilterBar";
import QuoteViewerToolbar from "./QuoteViewerToolbar";
import { QuotesTable } from "./QuotesTable";
import AddQuoteDialog from "../AddQuoteDialog";
import EditQuoteDialog from "../form/EditQuoteDialog";
import { Quote } from "@/types/quote";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface QuoteViewerProps {
  initialFilters?: Partial<QuoteFilters>;
  title?: string;
  showAddButton?: boolean;
  pageSize?: number;
}

const QuoteViewer: React.FC<QuoteViewerProps> = ({ 
  initialFilters,
  title = "Devis",
  showAddButton = true,
  pageSize = 10
}) => {
  const { 
    quotes, 
    loading, 
    filters, 
    contactOptions,
    freelancerOptions,
    editingQuoteId,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
    loadQuotes,
    setEditingQuoteId
  } = useQuotesViewer(initialFilters);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleQuoteCreated = () => {
    loadQuotes();
  };

  const handleEditClick = (quoteId: string) => {
    setEditingQuoteId(quoteId);
  };

  const handleStatusChange = () => {
    loadQuotes();
  };

  // Pagination
  const totalPages = Math.ceil(quotes.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedQuotes = quotes.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      
      <QuoteViewerToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onResetFilters={resetFilters}
        onAddClick={handleAddClick}
        freelancerOptions={freelancerOptions}
        contactOptions={contactOptions}
        showAddButton={showAddButton}
      />
      
      <QuotesTable
        quotes={paginatedQuotes}
        loading={loading}
        onStatusChange={handleStatusChange}
        onEditClick={handleEditClick}
      />
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              let pageNumber: number;
              
              // Logic to determine which page numbers to show
              if (totalPages <= 5) {
                pageNumber = idx + 1;
              } else if (currentPage <= 3) {
                pageNumber = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + idx;
              } else {
                pageNumber = currentPage - 2 + idx;
              }
              
              if (idx === 0 && pageNumber > 1) {
                return (
                  <React.Fragment key={idx}>
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => setCurrentPage(1)}
                        isActive={currentPage === 1}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {pageNumber > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </React.Fragment>
                );
              }
              
              if (idx === 4 && pageNumber < totalPages) {
                return (
                  <React.Fragment key={idx}>
                    {pageNumber < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => setCurrentPage(totalPages)}
                        isActive={currentPage === totalPages}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                );
              }
              
              return (
                <PaginationItem key={idx}>
                  <PaginationLink 
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      <AddQuoteDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onQuoteCreated={handleQuoteCreated}
      />
      
      {editingQuoteId && (
        <EditQuoteDialog
          open={!!editingQuoteId}
          onOpenChange={(open) => {
            if (!open) setEditingQuoteId(null);
          }}
          onQuoteUpdated={loadQuotes}
          quoteId={editingQuoteId}
        />
      )}
    </div>
  );
};

export default QuoteViewer;
