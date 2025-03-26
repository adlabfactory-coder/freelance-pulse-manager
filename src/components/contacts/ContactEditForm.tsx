
import React from 'react';
import { useContactForm } from './hooks/useContactForm';
import { Contact } from '@/services/contacts/types';
import ContactForm from './ContactForm';

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
    <ContactForm
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      isEditing={true}
      submitLabel="Mettre à jour le contact"
      onCancel={onCancel}
    />
  );
};

export default ContactEditForm;
