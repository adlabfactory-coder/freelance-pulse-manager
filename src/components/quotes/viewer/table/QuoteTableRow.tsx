
import React from "react";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Quote } from "@/types/quote";
import QuoteStatusBadge from "../../components/QuoteStatusBadge";
import { formatCurrency, formatDate } from "@/utils/format";

interface QuoteTableRowProps {
  quote: Quote;
  isSelected: boolean;
  onRowClick: (e: React.MouseEvent, quoteId: string) => void;
  onSelectQuote: (quoteId: string) => void;
  onEditClick: (quoteId: string) => void;
  onPreviewClick: (quoteId: string) => void;
  getContactName: (contactId: string) => string;
  getFreelancerFullName: (freelancerId: string) => string;
  formatReference: (id: string) => string;
}

const QuoteTableRow: React.FC<QuoteTableRowProps> = ({
  quote,
  isSelected,
  onRowClick,
  onSelectQuote,
  onEditClick,
  onPreviewClick,
  getContactName,
  getFreelancerFullName,
  formatReference
}) => {
  return (
    <TableRow 
      key={quote.id}
      onClick={(e) => onRowClick(e, quote.id)}
      className={`cursor-pointer ${isSelected ? 'bg-muted/40' : ''}`}
    >
      <TableCell className="w-12">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelectQuote(quote.id)}
          aria-label={`Sélectionner le devis ${formatReference(quote.id)}`}
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>
      <TableCell>{formatReference(quote.id)}</TableCell>
      <TableCell>
        {getContactName(quote.contactId)}
      </TableCell>
      <TableCell>
        {getFreelancerFullName(quote.freelancerId)}
      </TableCell>
      <TableCell>
        <QuoteStatusBadge status={quote.status} />
      </TableCell>
      <TableCell>
        {formatCurrency(quote.totalAmount)}
      </TableCell>
      <TableCell>
        {formatDate(new Date(quote.validUntil))}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPreviewClick(quote.id);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(quote.id);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default QuoteTableRow;
