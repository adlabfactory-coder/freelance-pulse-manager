import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Quote, QuoteStatus } from "@/types";
import { formatCurrency, formatDateToFrench } from "@/utils/format";
import { updateQuoteStatus, deleteQuote } from "@/services/quote-service";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash, FileEdit, MoreHorizontal, Check, X, Send, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import EditQuoteDialog from "./form/EditQuoteDialog";

interface QuotesTableProps {
  quotes: Quote[];
  loading?: boolean;
  onStatusChange?: () => void;
}

const QuotesTable: React.FC<QuotesTableProps> = ({ quotes, loading = false, onStatusChange }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isAdminOrSuperAdmin, user } = useAuth();

  const handleStatusChange = async (id: string | undefined, status: QuoteStatus) => {
    if (!id) return;
    
    try {
      const success = await updateQuoteStatus(id, status);
      if (success) {
        toast({
          title: "Statut mis à jour",
          description: `Le devis a été marqué comme ${
            status === QuoteStatus.ACCEPTED
              ? "accepté"
              : status === QuoteStatus.REJECTED
              ? "refusé"
              : status === QuoteStatus.SENT
              ? "envoyé"
              : status === QuoteStatus.DRAFT
              ? "brouillon"
              : status
          }`,
        });
        
        if (onStatusChange) {
          onStatusChange();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du devis",
      });
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteQuote(id);
      if (success) {
        toast({
          title: "Devis supprimé",
          description: "Le devis a été supprimé avec succès",
        });
        
        if (onStatusChange) {
          onStatusChange();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le devis",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(null);
    }
  };

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return <Badge variant="outline">Brouillon</Badge>;
      case QuoteStatus.SENT:
        return <Badge variant="default">Envoyé</Badge>;
      case QuoteStatus.ACCEPTED:
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Accepté</Badge>;
      case QuoteStatus.REJECTED:
        return <Badge variant="destructive">Refusé</Badge>;
      case QuoteStatus.EXPIRED:
        return <Badge variant="secondary">Expiré</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const viewQuoteDetails = (id: string | undefined) => {
    if (!id) return;
    navigate(`/quotes/${id}`);
  };

  const editQuote = (id: string | undefined) => {
    if (!id) return;
    setEditingQuoteId(id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">Aucun devis trouvé</h3>
        <p className="text-muted-foreground mt-2">
          Créez votre premier devis en cliquant sur le bouton "Ajouter un devis".
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Commercial</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Date limite</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => {
            const canManageQuote = isAdminOrSuperAdmin || 
              (user?.id === quote.freelancerId);
              
            return (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">{quote.contactId}</TableCell>
                <TableCell>{quote.freelancerId}</TableCell>
                <TableCell>{formatCurrency(quote.totalAmount)}</TableCell>
                <TableCell>
                  {formatDateToFrench(new Date(quote.validUntil))}
                </TableCell>
                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => viewQuoteDetails(quote.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      
                      {canManageQuote && (
                        <>
                          <DropdownMenuItem onClick={() => editQuote(quote.id)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                          
                          {quote.status !== QuoteStatus.SENT && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(quote.id, QuoteStatus.SENT)}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Marquer comme envoyé
                            </DropdownMenuItem>
                          )}
                          
                          {quote.status !== QuoteStatus.ACCEPTED && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(quote.id, QuoteStatus.ACCEPTED)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Marquer comme accepté
                            </DropdownMenuItem>
                          )}
                          
                          {quote.status !== QuoteStatus.REJECTED && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(quote.id, QuoteStatus.REJECTED)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Marquer comme refusé
                            </DropdownMenuItem>
                          )}
                          
                          {quote.status !== QuoteStatus.DRAFT && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(quote.id, QuoteStatus.DRAFT)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Remettre en brouillon
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => setIsDeleteDialogOpen(quote.id || null)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {editingQuoteId && (
        <EditQuoteDialog
          open={!!editingQuoteId}
          onOpenChange={(open) => {
            if (!open) setEditingQuoteId(null);
          }}
          quoteId={editingQuoteId}
          onQuoteUpdated={() => {
            if (onStatusChange) onStatusChange();
            setEditingQuoteId(null);
          }}
        />
      )}
      
      <AlertDialog 
        open={!!isDeleteDialogOpen} 
        onOpenChange={(open) => {
          if (!open) setIsDeleteDialogOpen(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce devis ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les informations liées à ce devis seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDelete(isDeleteDialogOpen || undefined)}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuotesTable;
