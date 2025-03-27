
import React from "react";
import { TableBody } from "@/components/ui/table";
import { Quote } from "@/types/quote";
import QuoteTableRow from "./QuoteTableRow";

interface QuoteTableBodyProps {
  quotes: Quote[];
  selectedQuoteIds: string[];
  onRowClick: (e: React.MouseEvent, quoteId: string) => void;
  onSelectQuote: (quoteId: string) => void;
  onEditClick: (quoteId: string) => void;
  onPreviewClick: (quoteId: string) => void;
  getContactName: (contactId: string) => string;
  getFreelancerFullName: (freelancerId: string) => string;
  formatReference: (id: string) => string;
}

const QuoteTableBody: React.FC<QuoteTableBodyProps> = ({
  quotes,
  selectedQuoteIds,
  onRowClick,
  onSelectQuote,
  onEditClick,
  onPreviewClick,
  getContactName,
  getFreelancerFullName,
  formatReference
}) => {
  const isSelected = (quoteId: string) => selectedQuoteIds.includes(quoteId);
  
  return (
    <TableBody>
      {quotes.map((quote) => (
        <QuoteTableRow
          key={quote.id}
          quote={quote}
          isSelected={isSelected(quote.id)}
          onRowClick={onRowClick}
          onSelectQuote={onSelectQuote}
          onEditClick={onEditClick}
          onPreviewClick={onPreviewClick}
          getContactName={getContactName}
          getFreelancerFullName={getFreelancerFullName}
          formatReference={formatReference}
        />
      ))}
    </TableBody>
  );
};

export default QuoteTableBody;
