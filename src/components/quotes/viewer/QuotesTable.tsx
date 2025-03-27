
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  ArrowUpDown, 
  Eye
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote, QuoteStatus } from "@/types/quote";
import QuoteStatusBadge from "../components/QuoteStatusBadge";
import EditQuoteDialog from "../form/EditQuoteDialog";
import QuotePreviewDialog from "./QuotePreviewDialog";
import { formatCurrency, formatDate } from "@/utils/format";

interface QuotesTableProps {
  quotes: Quote[];
  loading: boolean;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  editingQuoteId: string | null;
  previewQuoteId: string | null;
  contactsMap: Record<string, any>;
  freelancersMap: Record<string, any>;
  onSort: (column: string) => void;
  onEditClick: (quoteId: string) => void;
  onPreviewClick: (quoteId: string) => void;
  onEditComplete: () => void;
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
  onSort,
  onEditClick,
  onPreviewClick,
  onEditComplete,
  getContactName,
  getFreelancerFullName,
  formatReference,
  getQuoteById,
  getQuoteItems
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const getSortIcon = (column: string) => {
    if (sortColumn === column) {
      return (
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`}
        />
      );
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
  };

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

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Commercial</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Validité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">Aucun devis trouvé</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Commercial</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort("totalAmount")}
            >
              <div className="flex items-center">
                Montant {getSortIcon("totalAmount")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort("validUntil")}
            >
              <div className="flex items-center">
                Validité {getSortIcon("validUntil")}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell>{formatReference(quote.id)}</TableCell>
              <TableCell>
                {getContactName(quote.contactId)}
              </TableCell>
              <TableCell>
                {getFreelancerFullName(quote.freelancerId)}
              </TableCell>
              <TableCell>
                <QuoteStatusBadge status={quote.status as QuoteStatus} />
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
                    onClick={() => handlePreviewClick(quote.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditClick(quote.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
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
