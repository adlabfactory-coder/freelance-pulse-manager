
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import { QuoteStatus } from "@/types/quote";
import { deleteQuote, updateQuoteStatus } from "@/services/quote-service";
import { useToast } from "@/hooks/use-toast";

interface QuoteActionsProps {
  quoteId: string;
  status: QuoteStatus;
  canEdit: boolean;
  onStatusChange: () => void;
  onEditClick: (id: string) => void;
}

const QuoteActions: React.FC<QuoteActionsProps> = ({ 
  quoteId, 
  status, 
  canEdit, 
  onStatusChange,
  onEditClick
}) => {
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      await deleteQuote(quoteId);
      toast({
        title: "Succès",
        description: "Le devis a été supprimé avec succès",
      });
      onStatusChange();
    } catch (error) {
      console.error("Erreur lors de la suppression du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du devis",
      });
    } finally {
      setConfirmDelete(false);
    }
  };

  const handleStatusChange = async (newStatus: QuoteStatus) => {
    try {
      await updateQuoteStatus(quoteId, newStatus);
      toast({
        title: "Succès",
        description: `Le statut du devis a été mis à jour: ${newStatus}`,
      });
      onStatusChange();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut",
      });
    }
  };

  if (confirmDelete) {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setConfirmDelete(false)}
        >
          Annuler
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleDelete}
        >
          Confirmer
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canEdit && (
          <DropdownMenuItem onClick={() => onEditClick(quoteId)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
        )}
        
        {canEdit && status === QuoteStatus.DRAFT && (
          <DropdownMenuItem onClick={() => handleStatusChange(QuoteStatus.PENDING)}>
            <Clock className="mr-2 h-4 w-4" />
            Marquer comme En attente
          </DropdownMenuItem>
        )}

        {canEdit && (status === QuoteStatus.DRAFT || status === QuoteStatus.PENDING) && (
          <DropdownMenuItem onClick={() => handleStatusChange(QuoteStatus.ACCEPTED)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Marquer comme Accepté
          </DropdownMenuItem>
        )}

        {canEdit && (status === QuoteStatus.DRAFT || status === QuoteStatus.PENDING) && (
          <DropdownMenuItem onClick={() => handleStatusChange(QuoteStatus.REJECTED)}>
            <XCircle className="mr-2 h-4 w-4" />
            Marquer comme Rejeté
          </DropdownMenuItem>
        )}

        {canEdit && (
          <DropdownMenuItem onClick={() => setConfirmDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuoteActions;
