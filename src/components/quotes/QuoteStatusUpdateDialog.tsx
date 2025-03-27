
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteStatus, getQuoteStatusLabel } from '@/types/quote';
import { Loader2 } from 'lucide-react';

interface QuoteStatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: QuoteStatus;
  newStatus: QuoteStatus;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const QuoteStatusUpdateDialog: React.FC<QuoteStatusUpdateDialogProps> = ({
  open,
  onOpenChange,
  currentStatus,
  newStatus,
  onConfirm,
  isSubmitting
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modification du statut</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de changer le statut du devis de 
            <span className="font-semibold"> {getQuoteStatusLabel(currentStatus)} </span> 
            à <span className="font-semibold"> {getQuoteStatusLabel(newStatus)}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {newStatus === QuoteStatus.ACCEPTED && (
            <p className="text-sm text-amber-600">
              Cette action pourrait déclencher la création d'un contrat et affecter les commissions.
              Veuillez confirmer que le client a accepté ce devis.
            </p>
          )}
          {newStatus === QuoteStatus.REJECTED && (
            <p className="text-sm text-amber-600">
              Cette action indiquera que le client a refusé ce devis.
              Un suivi pourrait être nécessaire pour comprendre les raisons du refus.
            </p>
          )}
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : (
              "Confirmer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteStatusUpdateDialog;
