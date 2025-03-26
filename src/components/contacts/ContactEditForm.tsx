
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useContactForm } from './hooks/useContactForm';
import { Contact } from '@/services/contacts/types';
import ContactFormFields from './ContactFormFields';

interface ContactEditFormProps {
  contact: Contact;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ContactEditForm: React.FC<ContactEditFormProps> = ({
  contact,
  onSuccess,
  onCancel
}) => {
  const { form, isSubmitting, onSubmit } = useContactForm({
    initialData: contact,
    onSuccess,
    isEditing: true
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <ContactFormFields form={form} isEditing={true} />
        
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Mettre à jour le contact"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactEditForm;
