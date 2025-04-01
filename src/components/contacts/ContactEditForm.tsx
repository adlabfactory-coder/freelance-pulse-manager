
import React from "react";
import { Contact } from "@/services/contacts/types";
import ContactForm from "./ContactForm";
import { useAuth } from "@/hooks/use-auth";
import { useContactForm } from "@/hooks/useContactForm";

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
  
  const contactWithAssignedTo = {
    ...contact,
    assignedTo: contact.assignedTo || user?.id || ""
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
      contactId={contact.id}
    />
  );
};

export default ContactEditForm;
