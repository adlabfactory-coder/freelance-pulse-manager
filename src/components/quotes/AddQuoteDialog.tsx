import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuoteForm from "./form/QuoteForm";
import { useQuoteForm } from "@/hooks/useQuoteForm";

interface AddQuoteDialogProps {
  onQuoteAdded?: () => void;
  trigger?: React.ReactNode;
}

export function AddQuoteDialog({ onQuoteAdded, trigger }: AddQuoteDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleDiscard = () => {
    setOpen(false);
  };

  const quoteForm = useQuoteForm({
    onSuccess: () => {
      setOpen(false);
      if (onQuoteAdded) {
        onQuoteAdded();
      }
    }
  });

  const onCloseDialog = () => {
    setOpen(false);
  };

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
          form={quoteForm.form}
          isSubmitting={quoteForm.isSubmitting}
          onSubmit={quoteForm.onSubmit}
          onDiscard={handleDiscard}
          onCloseDialog={onCloseDialog}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AddQuoteDialog;
