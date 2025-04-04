
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuoteForm } from '@/hooks/quotes/useQuoteForm';
import QuoteFormSections from './QuoteFormSections';
import { Quote, QuoteItem } from '@/types';
import { Loader2 } from 'lucide-react';
import { QuoteStatus } from '@/types/quote';

interface QuoteFormProps {
  form: ReturnType<typeof useQuoteForm>;
  onDiscard?: () => void;
  onCloseDialog?: (open: boolean) => void;
  isSubmitting?: boolean;
  onSubmit?: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ 
  form, 
  onDiscard,
  isSubmitting = form.isSubmitting, 
  onSubmit,
  onCloseDialog
}) => {
  // S'assurer que tous les éléments sont des QuoteItem valides
  const safeItems: QuoteItem[] = form.items 
    ? form.items.filter((item): item is QuoteItem => {
        return Boolean(
          item && 
          item.description !== undefined && 
          item.quantity !== undefined && 
          item.unitPrice !== undefined
        );
      })
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, calling handleSubmit");
    
    if (onSubmit) {
      onSubmit();
    } else {
      console.log("Form data before submission:", {
        contactId: form.contactId,
        freelancerId: form.freelancerId,
        validUntil: form.validUntil,
        status: form.status,
        notes: form.notes,
        folder: form.folder,
        totalAmount: form.totalAmount,
        items: safeItems
      });
      
      // Correction: transformer les items partiels en items complets pour le formulaire
      const validItems = safeItems.map(item => {
        // Assurez-vous que tous les champs requis sont présents
        return {
          id: item.id || "",
          quoteId: item.quoteId || "",
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          tax: item.tax || 0,
          discount: item.discount || 0,
          serviceId: item.serviceId
        };
      });
      
      const quoteData = {
        contactId: form.contactId,
        freelancerId: form.freelancerId,
        validUntil: form.validUntil,
        status: form.status as QuoteStatus,
        notes: form.notes || "",
        folder: form.folder || 'general',
        totalAmount: form.totalAmount || 0,
        items: validItems
      };
      
      await form.handleSubmit(quoteData, safeItems);
    }
  };

  // Ensure validUntil is a Date object
  const handleDateChange = (date: Date | string) => {
    if (typeof date === 'string') {
      try {
        form.setValidUntil(new Date(date));
      } catch (error) {
        console.error("Erreur lors de la conversion de la date:", error);
      }
    } else {
      form.setValidUntil(date);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <QuoteFormSections
        quoteData={{
          contactId: form.contactId,
          freelancerId: form.freelancerId,
          validUntil: form.validUntil,
          status: form.status,
          notes: form.notes,
          items: safeItems,
          totalAmount: form.totalAmount || 0
        }}
        currentItem={form.currentItem || {}}
        contacts={form.contacts || []}
        freelancers={form.freelancers || []}
        services={form.services || []}
        onQuoteDataChange={(data) => {
          if (data.contactId !== undefined) form.setContactId(data.contactId);
          if (data.freelancerId !== undefined) form.setFreelancerId(data.freelancerId);
          // Handle validUntil date properly
          if (data.validUntil !== undefined) {
            handleDateChange(data.validUntil);
          }
          if (data.status !== undefined) form.setStatus(data.status as QuoteStatus);
          if (data.notes !== undefined) form.setNotes(data.notes);
        }}
        onCurrentItemChange={form.setCurrentItem}
        onAddItem={form.handleAddItem}
        onRemoveItem={form.handleRemoveItem}
      />

      <div className="flex justify-end space-x-2">
        {onDiscard && (
          <Button type="button" variant="outline" onClick={onDiscard}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer le devis"
          )}
        </Button>
      </div>
    </form>
  );
};

export default QuoteForm;
