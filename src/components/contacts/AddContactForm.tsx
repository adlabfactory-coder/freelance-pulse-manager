
import React from "react";
import { useContactForm } from "./hooks/useContactForm";
import ContactForm from "./ContactForm";

interface AddContactFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddContactForm({ onSuccess, onCancel }: AddContactFormProps) {
  const { form, isSubmitting, onSubmit } = useContactForm({ 
    onSuccess,
    isEditing: false
  });

  return (
    <ContactForm
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      isEditing={false}
      submitLabel="Ajouter le contact"
      onCancel={onCancel}
    />
  );
}

export default AddContactForm;
