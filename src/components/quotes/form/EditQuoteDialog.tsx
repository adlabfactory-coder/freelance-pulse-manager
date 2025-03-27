
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuoteForm } from "@/hooks/quotes/useQuoteForm";
import QuoteDialogContent from "./QuoteDialogContent";
import { Quote, QuoteItem } from "@/types";
import { QuoteStatus } from "@/types/quote";

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
      console.log("EditQuoteDialog opened, loading data");
      loadData();
      if (initialQuote) {
        console.log('Setting initial quote data:', initialQuote);
        // Convertir le statut en QuoteStatus pour assurer la compatibilité de type
        const convertedQuote = {
          ...initialQuote,
          status: initialQuote.status as QuoteStatus
        };
        setQuoteData(convertedQuote);
      } else if (quoteId) {
        console.log('Loading quote data for ID:', quoteId);
        loadQuoteData(quoteId);
      }
    }
  }, [open, quoteId, initialQuote, loadData, loadQuoteData, setQuoteData]);

  // Nous nous assurons que les items sont complets et valides ici
  const safeQuoteData: Partial<Quote> = {
    ...quoteData,
    // Ne gardons que les éléments non marqués pour suppression qui ont toutes les propriétés requises
    items: quoteData.items
      ? quoteData.items
        .filter((item): item is QuoteItem => {
          return Boolean(
            item && 
            item.description !== undefined && 
            item.quantity !== undefined && 
            item.unitPrice !== undefined
          );
        })
      : []
  };

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
          quoteData={safeQuoteData}
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
