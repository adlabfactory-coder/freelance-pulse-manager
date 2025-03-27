
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuoteForm } from "../hooks/useQuoteForm";
import QuoteDialogContent from "./QuoteDialogContent";
import { Quote } from "@/types";

interface EditQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteUpdated: () => void;
  quoteId: string;
  initialQuote?: Quote;
}

const EditQuoteDialog: React.FC<EditQuoteDialogProps> = ({
  open,
  onOpenChange,
  onQuoteUpdated,
  quoteId,
  initialQuote
}) => {
  const quoteForm = useQuoteForm({
    onSuccess: onQuoteUpdated,
    onCloseDialog: onOpenChange,
    isEditing: true,
    quoteId
  });

  const {
    contacts,
    freelancers,
    services,
    isSubmitting,
    loading,
    quoteData,
    currentItem,
    setQuoteData,
    setCurrentItem,
    handleAddItem,
    handleRemoveItem,
    handleSubmitEdit,
    loadData,
    loadQuoteData
  } = quoteForm;

  useEffect(() => {
    if (open) {
      loadData();
      if (initialQuote) {
        setQuoteData(initialQuote);
      } else if (quoteId) {
        loadQuoteData(quoteId);
      }
    }
  }, [open, quoteId, initialQuote]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le devis</DialogTitle>
          <DialogDescription>
            Modifiez les informations du devis ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <QuoteDialogContent
          loading={loading}
          isSubmitting={isSubmitting}
          quoteData={quoteData}
          currentItem={currentItem}
          contacts={contacts}
          freelancers={freelancers}
          services={services}
          onQuoteDataChange={setQuoteData}
          onCurrentItemChange={setCurrentItem}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onSubmit={() => handleSubmitEdit(quoteId)}
          onCancel={() => onOpenChange(false)}
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditQuoteDialog;
