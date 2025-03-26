
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Check, 
  X, 
  Clock, 
  FileText, 
  Pencil, 
  Trash2, 
  Send,
  Copy
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote, QuoteStatus } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { deleteQuote, updateQuoteStatus } from "@/services/quote-service";
import EditQuoteDialog from "./form/EditQuoteDialog";

interface QuotesTableProps {
  quotes: Quote[];
  loading: boolean;
  onStatusChange: () => void;
}

const QuotesTable: React.FC<QuotesTableProps> = ({ quotes, loading, onStatusChange }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmSendId, setConfirmSendId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  const getStatusBadgeVariant = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.ACCEPTED:
        return "default" as const;
      case QuoteStatus.REJECTED:
        return "destructive";
      case QuoteStatus.SENT:
        return "secondary";
      case QuoteStatus.EXPIRED:
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT: return "Brouillon";
      case QuoteStatus.SENT: return "Envoyé";
      case QuoteStatus.ACCEPTED: return "Accepté";
      case QuoteStatus.REJECTED: return "Rejeté";
      case QuoteStatus.EXPIRED: return "Expiré";
      default: return status;
    }
  };

  const handleViewDetail = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };

  const handleEditQuote = (quote: Quote) => {
    setCurrentQuote(quote);
    setEditDialogOpen(true);
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const success = await deleteQuote(quoteId);
      if (success) {
        toast({
          title: "Devis supprimé",
          description: "Le devis a été supprimé avec succès.",
        });
        onStatusChange();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer le devis.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du devis.",
      });
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleDuplicateQuote = (quote: Quote) => {
    const duplicateQuote = {
      ...quote,
      id: undefined,
      status: QuoteStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCurrentQuote(duplicateQuote as Quote);
    setEditDialogOpen(true);
    
    toast({
      title: "Devis dupliqué",
      description: "Vous pouvez maintenant modifier le duplicata du devis.",
    });
  };

  const handleSendQuote = async (quoteId: string) => {
    try {
      const success = await updateQuoteStatus(quoteId, QuoteStatus.SENT);
      if (success) {
        toast({
          title: "Devis envoyé",
          description: "Le devis a été marqué comme envoyé.",
        });
        onStatusChange();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour le statut du devis.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du devis.",
      });
    } finally {
      setConfirmSendId(null);
    }
  };

  const handleChangeStatus = async (quoteId: string, status: QuoteStatus) => {
    try {
      const success = await updateQuoteStatus(quoteId, status);
      if (success) {
        toast({
          title: "Statut mis à jour",
          description: `Le devis a été marqué comme "${getStatusLabel(status)}".`,
        });
        onStatusChange();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour le statut du devis.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
      });
    }
  };

  if (loading) {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Commercial</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-9 w-9 rounded-md ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">Aucun devis trouvé.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Commercial</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">{quote.id?.substring(0, 8)}</TableCell>
                <TableCell>{quote.contactId}</TableCell>
                <TableCell>{quote.freelancerId}</TableCell>
                <TableCell>{formatCurrency(quote.totalAmount)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(quote.status)}>
                    {getStatusLabel(quote.status)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(quote.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => handleViewDetail(quote.id!)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Voir le détail
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => handleDuplicateQuote(quote)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Dupliquer
                      </DropdownMenuItem>
                      
                      {quote.status === QuoteStatus.DRAFT && (
                        <DropdownMenuItem onClick={() => setConfirmSendId(quote.id!)}>
                          <Send className="mr-2 h-4 w-4" />
                          Envoyer
                        </DropdownMenuItem>
                      )}
                      
                      {quote.status !== QuoteStatus.ACCEPTED && quote.status !== QuoteStatus.REJECTED && (
                        <DropdownMenuItem onClick={() => handleChangeStatus(quote.id!, QuoteStatus.ACCEPTED)}>
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          Marquer comme accepté
                        </DropdownMenuItem>
                      )}
                      
                      {quote.status !== QuoteStatus.REJECTED && quote.status !== QuoteStatus.ACCEPTED && (
                        <DropdownMenuItem onClick={() => handleChangeStatus(quote.id!, QuoteStatus.REJECTED)}>
                          <X className="mr-2 h-4 w-4 text-red-500" />
                          Marquer comme rejeté
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={() => setConfirmDeleteId(quote.id!)}
                        className="text-red-500 focus:text-red-500 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Boîte de dialogue de confirmation pour la suppression */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce devis ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmDeleteId && handleDeleteQuote(confirmDeleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Boîte de dialogue de confirmation pour l'envoi */}
      <AlertDialog open={!!confirmSendId} onOpenChange={() => setConfirmSendId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'envoi</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir marquer ce devis comme envoyé ? Un email sera envoyé au client.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmSendId && handleSendQuote(confirmSendId)}
            >
              Envoyer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialogue de modification */}
      <EditQuoteDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onQuoteUpdated={onStatusChange}
        quoteId={currentQuote?.id || ""}
        initialQuote={currentQuote || undefined}
      />
    </>
  );
};

export default QuotesTable;
