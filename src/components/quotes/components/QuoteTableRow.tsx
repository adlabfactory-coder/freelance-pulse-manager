
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Quote } from "@/types/quote";
import { formatCurrency } from "@/utils/format";
import QuoteStatusBadge from "./QuoteStatusBadge";
import QuoteDateDisplay from "./QuoteDateDisplay";
import QuoteActions from "./QuoteActions";

interface QuoteTableRowProps {
  quote: Quote;
  onStatusChange: () => void;
  onEditClick: (id: string) => void;
  canEdit: (quote: Quote) => boolean;
  getContactName: (contactId: string) => string;
  getFreelancerFullName: (freelancerId: string) => string;
  formatReference: (id: string) => string;
}

const QuoteTableRow: React.FC<QuoteTableRowProps> = ({
  quote,
  onStatusChange,
  onEditClick,
  canEdit,
  getContactName,
  getFreelancerFullName,
  formatReference
}) => {
  return (
    <TableRow>
      <TableCell>{formatReference(quote.id)}</TableCell>
      <TableCell>{getContactName(quote.contactId)}</TableCell>
      <TableCell>{getFreelancerFullName(quote.freelancerId)}</TableCell>
      <TableCell>{formatCurrency(quote.totalAmount)}</TableCell>
      <TableCell>
        <QuoteStatusBadge status={quote.status} />
      </TableCell>
      <TableCell>
        <QuoteDateDisplay date={quote.validUntil} type="validUntil" />
      </TableCell>
      <TableCell>
        <QuoteDateDisplay date={quote.updatedAt} type="updatedAt" />
      </TableCell>
      <TableCell className="text-right">
        <QuoteActions
          quoteId={quote.id}
          status={quote.status}
          canEdit={canEdit(quote)}
          onStatusChange={onStatusChange}
          onEditClick={onEditClick}
        />
      </TableCell>
    </TableRow>
  );
};

export default QuoteTableRow;
