
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuoteForm } from "./hooks/useQuoteForm";
import QuoteDialogContent from "./form/QuoteDialogContent";

interface AddQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteCreated: () => void;
  initialContactId?: string;
}

const AddQuoteDialog: React.FC<AddQuoteDialogProps> = ({
  open,
  onOpenChange,
  onQuoteCreated,
  initialContactId
}) => {
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
    handleSubmit,
    loadData,
  } = useQuoteForm({
    onCloseDialog: onOpenChange,
    onQuoteCreated
  });

  useEffect(() => {
    if (open) {
      loadData();
      
      // Si un ID de contact est fourni, définissez-le comme contactId initial
      if (initialContactId) {
        setQuoteData(prev => ({
          ...prev,
          contactId: initialContactId
        }));
      }
    }
  }, [open, initialContactId, loadData, setQuoteData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau devis</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouveau devis.
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
          onSubmit={() => handleSubmit()}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddQuoteDialog;
