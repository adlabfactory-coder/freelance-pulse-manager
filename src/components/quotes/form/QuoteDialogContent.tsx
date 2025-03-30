
import React, { useEffect } from "react";
import QuoteForm from "./QuoteForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Quote, QuoteItem } from "@/types";
import { Contact } from "@/services/contacts/types";
import { Service } from "@/types/service";
import { User } from "@/types/user";

interface QuoteDialogContentProps {
  loading: boolean;
  isSubmitting: boolean;
  quoteData: Partial<Quote> & { items: QuoteItem[] };
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
  console.log("QuoteDialogContent rendered with data:", { quoteData, loading, isSubmitting });
  
  // Composant de formulaire personnalisé
  const mockForm = {
    loading,
    isSubmitting,
    contactId: quoteData.contactId || "",
    freelancerId: quoteData.freelancerId || "",
    validUntil: quoteData.validUntil || new Date(),
    status: quoteData.status || "draft",
    notes: quoteData.notes || "",
    folder: quoteData.folder || "general",
    items: quoteData.items || [],
    currentItem: currentItem || {},
    totalAmount: quoteData.totalAmount || 0,
    contacts,
    freelancers,
    services,
    setContactId: (contactId: string) => onQuoteDataChange({ ...quoteData, contactId }),
    setFreelancerId: (freelancerId: string) => onQuoteDataChange({ ...quoteData, freelancerId }),
    setValidUntil: (validUntil: Date) => onQuoteDataChange({ ...quoteData, validUntil }),
    setStatus: (status: string) => onQuoteDataChange({ ...quoteData, status }),
    setNotes: (notes: string) => onQuoteDataChange({ ...quoteData, notes }),
    setFolder: (folder: string) => onQuoteDataChange({ ...quoteData, folder }),
    setCurrentItem: onCurrentItemChange,
    handleAddItem: onAddItem,
    handleRemoveItem: onRemoveItem,
    handleSubmit: onSubmit
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }
  
  console.log("QuoteDialogContent with form:", mockForm);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">
        {isEditing ? "Modifier le devis" : "Créer un nouveau devis"}
      </h2>
      
      <QuoteForm
        form={mockForm}
        onDiscard={onCancel}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default QuoteDialogContent;
