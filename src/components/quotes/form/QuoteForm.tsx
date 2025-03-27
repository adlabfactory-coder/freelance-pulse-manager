
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
  // Nous devons nous assurer que tous les éléments partiels sont complets avant de les passer
  // au composant QuoteFormSections, pour éviter les erreurs de type
  const safeItems: QuoteItem[] = form.items 
    ? form.items.filter((item): item is QuoteItem => {
        // Vérifier que chaque élément a les propriétés requises
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
      await form.handleSubmit(e);
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
          if (data.validUntil !== undefined) form.setValidUntil(data.validUntil);
          if (data.status !== undefined) form.setStatus(data.status);
          if (data.notes !== undefined) form.setNotes(data.notes);
        }}
        onCurrentItemChange={form.setCurrentItem}
        onAddItem={form.handleAddItem || form.addItem}
        onRemoveItem={form.handleRemoveItem || form.removeItem}
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
