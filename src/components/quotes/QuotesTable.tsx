
import React from "react";
import { Eye, Check, X } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Quote, QuoteStatus } from "@/types";
import { formatCurrency } from "@/utils/format";
import { updateQuoteStatus } from "@/services/quote-service";

interface QuotesTableProps {
  quotes: Quote[];
  loading: boolean;
  onStatusChange: () => void;
}

const QuotesTable: React.FC<QuotesTableProps> = ({ quotes, loading, onStatusChange }) => {
  
  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10">
            Brouillon
          </span>
        );
      case QuoteStatus.SENT:
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Envoyé
          </span>
        );
      case QuoteStatus.ACCEPTED:
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            Accepté
          </span>
        );
      case QuoteStatus.REJECTED:
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
            Refusé
          </span>
        );
      case QuoteStatus.EXPIRED:
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
            Expiré
          </span>
        );
      default:
        return null;
    }
  };
  
  const handleStatusChange = async (id: string, newStatus: QuoteStatus) => {
    const success = await updateQuoteStatus(id, newStatus);
    if (success) {
      onStatusChange(); // Trigger refresh
    }
  };

  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="hidden md:table-cell">Commercial</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="hidden md:table-cell">
              Date de création
            </TableHead>
            <TableHead className="hidden md:table-cell">
              Valide jusqu'au
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Chargement des devis...
              </TableCell>
            </TableRow>
          ) : quotes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Aucun devis trouvé
              </TableCell>
            </TableRow>
          ) : (
            quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">{quote.id?.substring(0, 8)}</TableCell>
                <TableCell>{quote.contactId}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {quote.freelancerId}
                </TableCell>
                <TableCell>{formatCurrency(quote.totalAmount)}</TableCell>
                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {quote.createdAt?.toLocaleDateString() || "-"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {quote.validUntil?.toLocaleDateString() || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {quote.status === QuoteStatus.SENT && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(quote.id!, QuoteStatus.ACCEPTED)}>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Marquer comme accepté
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(quote.id!, QuoteStatus.REJECTED)}>
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            Marquer comme refusé
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuotesTable;
