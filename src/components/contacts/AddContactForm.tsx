
import React from "react";
import { Button } from "@/components/ui/button";
import { useContactForm } from "@/hooks/useContactForm";
import ContactForm from "./ContactForm";
import { useAuth } from "@/hooks/use-auth";

interface AddContactFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddContactForm: React.FC<AddContactFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  
  const { form, isSubmitting, onSubmit } = useContactForm({
    onSuccess,
    isEditing: false,
    initialData: {
      // Pass empty values for initial form, but ensure we have assignedTo field
      // Leave this empty - it will be set in the form submission
      assignedTo: ""
    }
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
};

export default AddContactForm;
