
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuoteForm } from '../hooks/useQuoteForm';
import QuoteFormSections from './QuoteFormSections';

interface QuoteFormProps {
  form: ReturnType<typeof useQuoteForm>;
  onDiscard?: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ form, onDiscard }) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }} className="space-y-6">
      <QuoteFormSections
        contacts={form.contacts || []}
        freelancers={form.freelancers || []}
        services={form.services || []}
        contactId={form.contactId}
        setContactId={form.setContactId}
        freelancerId={form.freelancerId}
        setFreelancerId={form.setFreelancerId}
        validUntil={form.validUntil}
        setValidUntil={form.setValidUntil}
        status={form.status}
        setStatus={form.setStatus}
        notes={form.notes}
        setNotes={form.setNotes}
        loading={form.loading || false}
        items={form.items || []}
        currentItem={form.currentItem || {}}
        setCurrentItem={form.setCurrentItem}
        addItem={form.handleAddItem || form.addItem}
        removeItem={form.handleRemoveItem || form.removeItem}
        totalAmount={form.totalAmount || 0}
      />

      <div className="flex justify-end space-x-2">
        {onDiscard && (
          <Button type="button" variant="outline" onClick={onDiscard}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={form.isSubmitting}>
          {form.isSubmitting ? "Enregistrement..." : "Enregistrer le devis"}
        </Button>
      </div>
    </form>
  );
};

export default QuoteForm;
