
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuoteForm } from '../hooks/useQuoteForm';
import QuoteFormSections from './QuoteFormSections';
import { Quote, QuoteItem } from '@/types';
import { Loader2 } from 'lucide-react';

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
      // Correction: transformer les items partiels en items complets pour le formulaire
      const validItems = safeItems.map(item => {
        // Assurez-vous que tous les champs requis sont présents
        return {
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          tax: item.tax || 0,
          discount: item.discount || 0,
          serviceId: item.serviceId
        };
      });
      
      await form.handleSubmit({
        contactId: form.contactId,
        freelancerId: form.freelancerId,
        validUntil: form.validUntil,
        status: form.status,
        notes: form.notes,
        folder: form.folder || 'general',
        totalAmount: form.totalAmount || 0,
        items: validItems as QuoteItem[]
      }, safeItems);
    }
  };

  // Conversion des dates pour assurer la compatibilité
  const validUntil = form.validUntil 
    ? (typeof form.validUntil === 'string' ? new Date(form.validUntil) : form.validUntil) 
    : new Date();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <QuoteFormSections
        quoteData={{
          contactId: form.contactId,
          freelancerId: form.freelancerId,
          validUntil: validUntil,
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
          if (data.validUntil !== undefined) form.setValidUntil(data.validUntil);
          if (data.status !== undefined) form.setStatus(data.status);
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
