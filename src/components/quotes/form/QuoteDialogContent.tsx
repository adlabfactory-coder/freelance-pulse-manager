
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Save } from "lucide-react";
import { QuoteItem, Quote, User } from "@/types";
import { Contact } from "@/services/contacts/types";
import { Service } from "@/types/services";
import QuoteFormSections from "./QuoteFormSections";

interface QuoteDialogContentProps {
  loading: boolean;
  isSubmitting: boolean;
  quoteData: Partial<Quote>;
  currentItem: Partial<QuoteItem>;
  contacts: Contact[];
  freelancers: User[];
  services: Service[];
  onQuoteDataChange: (data: Partial<Quote>) => void;
  onCurrentItemChange: (item: Partial<QuoteItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const QuoteDialogContent: React.FC<QuoteDialogContentProps> = ({
  loading,
  isSubmitting,
  quoteData,
  currentItem,
  contacts,
  freelancers,
  services,
  onQuoteDataChange,
  onCurrentItemChange,
  onAddItem,
  onRemoveItem,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  if (loading) {
    return <div className="py-8 text-center">Chargement des données...</div>;
  }

  return (
    <>
      <QuoteFormSections
        quoteData={quoteData}
        currentItem={currentItem}
        contacts={contacts}
        freelancers={freelancers}
        services={services}
        onQuoteDataChange={onQuoteDataChange}
        onCurrentItemChange={onCurrentItemChange}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
        isEditing={isEditing}
      />

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button disabled={isSubmitting} onClick={onSubmit}>
          {isSubmitting ? (
            "Traitement en cours..."
          ) : isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" /> Mettre à jour
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" /> Créer le devis
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default QuoteDialogContent;
