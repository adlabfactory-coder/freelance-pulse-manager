
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Quote, QuoteStatus } from '@/types/quote';
import { Copy, Download, Edit, Mail, MoreHorizontal, Send, Trash2 } from 'lucide-react';
import QuoteStatusUpdateDialog from '../QuoteStatusUpdateDialog';
import { toast } from 'sonner';
import { updateQuoteStatus, deleteQuote } from '@/services/quote-service';

interface QuoteActionButtonsProps {
  quote: Quote;
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: (newStatus: QuoteStatus) => void;
}

const QuoteActionButtons: React.FC<QuoteActionButtonsProps> = ({
  quote,
  onDelete,
  onEdit,
  onStatusChange
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<QuoteStatus>(quote.status);
  
  const canBeAccepted = quote.status === QuoteStatus.SENT || quote.status === QuoteStatus.DRAFT;
  const canBeRejected = quote.status === QuoteStatus.SENT || quote.status === QuoteStatus.DRAFT;
  const canBeCancelled = quote.status !== QuoteStatus.CANCELLED;
  const canBeSent = quote.status === QuoteStatus.DRAFT;
  
  const handleStatusUpdate = async () => {
    setIsUpdatingStatus(true);
    try {
      const success = await updateQuoteStatus(quote.id, newStatus);
      if (success) {
        toast.success(`Le statut du devis a été mis à jour avec succès.`);
        onStatusChange(newStatus);
      } else {
        toast.error("Erreur lors de la mise à jour du statut du devis.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      toast.error("Une erreur s'est produite lors de la mise à jour du statut.");
    } finally {
      setIsUpdatingStatus(false);
      setStatusDialogOpen(false);
    }
  };
  
  const handleDeleteQuote = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
      try {
        const success = await deleteQuote(quote.id);
        if (success) {
          toast.success("Le devis a été supprimé avec succès.");
          onDelete();
        } else {
          toast.error("Erreur lors de la suppression du devis.");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du devis :", error);
        toast.error("Une erreur s'est produite lors de la suppression du devis.");
      }
    }
  };
  
  const handleStatusChange = (status: QuoteStatus) => {
    setNewStatus(status);
    setStatusDialogOpen(true);
  };
  
  const handlePrintOrDownload = () => {
    // Implémentation à venir
    toast.info("La fonctionnalité d'impression/téléchargement sera disponible prochainement.");
  };
  
  const handleSendEmail = () => {
    // Implémentation à venir
    toast.info("La fonctionnalité d'envoi par email sera disponible prochainement.");
  };
  
  return (
    <>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
        
        {canBeSent && (
          <Button size="sm" onClick={() => handleStatusChange(QuoteStatus.SENT)}>
            <Send className="h-4 w-4 mr-2" />
            Envoyer
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handlePrintOrDownload}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleSendEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Envoyer par email
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => {
              const url = `/quotes/duplicate/${quote.id}`;
              window.location.href = url;
            }}>
              <Copy className="h-4 w-4 mr-2" />
              Dupliquer
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
            
            {canBeAccepted && (
              <DropdownMenuItem onClick={() => handleStatusChange(QuoteStatus.ACCEPTED)}>
                Marquer comme accepté
              </DropdownMenuItem>
            )}
            
            {canBeRejected && (
              <DropdownMenuItem onClick={() => handleStatusChange(QuoteStatus.REJECTED)}>
                Marquer comme refusé
              </DropdownMenuItem>
            )}
            
            {canBeCancelled && (
              <DropdownMenuItem onClick={() => handleStatusChange(QuoteStatus.CANCELLED)}>
                Annuler le devis
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleDeleteQuote}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <QuoteStatusUpdateDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        currentStatus={quote.status}
        newStatus={newStatus}
        onConfirm={handleStatusUpdate}
        isSubmitting={isUpdatingStatus}
      />
    </>
  );
};

export default QuoteActionButtons;
