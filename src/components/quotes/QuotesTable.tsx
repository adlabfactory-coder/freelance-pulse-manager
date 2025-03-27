
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { FileText } from "lucide-react";
import { Quote } from "@/types/quote";
import { Skeleton } from "@/components/ui/skeleton";
import EditQuoteDialog from "./form/EditQuoteDialog";
import { useAuth } from "@/hooks/use-auth";
import useQuoteTable from "@/hooks/quotes/useQuoteTable";
import QuoteTableHeader from "./components/QuoteTableHeader";
import QuoteTableRow from "./components/QuoteTableRow";

interface QuotesTableProps {
  quotes: Quote[];
  loading: boolean;
  onStatusChange: () => void;
}

const QuotesTable: React.FC<QuotesTableProps> = ({ quotes, loading, onStatusChange }) => {
  const { user, isAdminOrSuperAdmin } = useAuth();
  const {
    sortColumn,
    sortedQuotes,
    editingQuoteId,
    setEditingQuoteId,
    handleSort,
    getContactName,
    getFreelancerFullName,
    formatReference
  } = useQuoteTable(quotes);

  const canEdit = (quote: Quote) => {
    return isAdminOrSuperAdmin || quote.freelancerId === user?.id;
  };

  if (loading) {
    return (
      <div className="w-full overflow-auto">
        <Table>
          <QuoteTableHeader onSort={handleSort} sortColumn={sortColumn} />
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td><Skeleton className="h-5 w-20" /></td>
                <td><Skeleton className="h-5 w-28" /></td>
                <td><Skeleton className="h-5 w-28" /></td>
                <td><Skeleton className="h-5 w-20" /></td>
                <td><Skeleton className="h-5 w-24" /></td>
                <td><Skeleton className="h-5 w-24" /></td>
                <td><Skeleton className="h-5 w-24" /></td>
                <td><Skeleton className="h-5 w-20 ml-auto" /></td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (sortedQuotes.length === 0) {
    return (
      <div className="bg-muted/20 p-8 text-center rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Aucun devis</h3>
        <p className="text-muted-foreground mt-2">
          Vous n'avez pas encore créé de devis ou aucun devis ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-auto">
        <Table>
          <QuoteTableHeader onSort={handleSort} sortColumn={sortColumn} />
          <TableBody>
            {sortedQuotes.map((quote) => (
              <QuoteTableRow
                key={quote.id}
                quote={quote}
                onStatusChange={onStatusChange}
                onEditClick={setEditingQuoteId}
                canEdit={canEdit}
                getContactName={getContactName}
                getFreelancerFullName={getFreelancerFullName}
                formatReference={formatReference}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {editingQuoteId && (
        <EditQuoteDialog
          open={!!editingQuoteId}
          onOpenChange={(open) => {
            if (!open) setEditingQuoteId(null);
          }}
          onQuoteUpdated={onStatusChange}
          quoteId={editingQuoteId}
        />
      )}
    </>
  );
};

export default QuotesTable;
