
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuoteForm from "./form/QuoteForm";
import { useQuoteForm } from "@/hooks/useQuoteForm";

interface AddQuoteDialogProps {
  onQuoteAdded?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onQuoteCreated?: () => void;
  initialContactId?: string;
}

export function AddQuoteDialog({ 
  onQuoteAdded, 
  trigger, 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  onQuoteCreated,
  initialContactId
}: AddQuoteDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  
  // Use either controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  const handleDiscard = () => {
    setOpen(false);
  };

  const handleSuccess = (id?: string) => {
    setOpen(false);
    if (onQuoteAdded) {
      onQuoteAdded();
    }
    if (onQuoteCreated) {
      onQuoteCreated();
    }
  };

  const quoteForm = useQuoteForm({
    onSuccess: handleSuccess,
    onCloseDialog: setOpen
  });

  React.useEffect(() => {
    if (open && initialContactId) {
      quoteForm.setContactId(initialContactId);
    }
  }, [open, initialContactId]);

  React.useEffect(() => {
    if (open) {
      quoteForm.loadData();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un devis
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau devis</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau devis.
          </DialogDescription>
        </DialogHeader>
        <QuoteForm
          form={quoteForm}
          onDiscard={handleDiscard}
          onCloseDialog={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AddQuoteDialog;
