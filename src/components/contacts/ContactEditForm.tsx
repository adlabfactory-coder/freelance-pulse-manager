import React from "react";
import { useContactForm } from "@/hooks/useContactForm";
import { Contact } from "@/services/contacts/types";
import ContactForm from "./ContactForm";
import { useAuth } from "@/hooks/use-auth";

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
  const { user } = useAuth();
  
  // Make sure we keep the existing assignedTo if present, or fall back to the current user
  const contactWithAssignedTo = {
    ...contact,
    // Preserve the existing assignedTo value if it exists and is valid
    assignedTo: contact.assignedTo || ""
  };
  
  const { form, isSubmitting, onSubmit } = useContactForm({
    initialData: contactWithAssignedTo,
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
