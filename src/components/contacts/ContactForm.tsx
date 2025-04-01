
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "./schema/contactFormSchema";
import { useAuth } from "@/hooks/use-auth";
import ContactFormFields from "./form/ContactFormFields";
import DuplicateCheckFields from "./form/DuplicateCheckFields";
import AccountManagerSelector from "./form/AccountManagerSelector";
import StatusSelector from "./form/StatusSelector";
import FormActions from "./form/FormActions";

interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  submitLabel?: string;
  contactId?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  form,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditing = false,
  submitLabel = "Soumettre",
  contactId
}) => {
  const { user } = useAuth();
  const [useAutoAssign, setUseAutoAssign] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Champ Nom */}
          <ContactFormFields form={form} />
          
          {/* Champs avec vérification de doublons */}
          <DuplicateCheckFields form={form} contactId={contactId} />
          
          <AccountManagerSelector 
            form={form} 
            isEditing={isEditing} 
            onAutoAssignChange={setUseAutoAssign}
            useAutoAssign={useAutoAssign}
          />

          <StatusSelector 
            form={form} 
            isEditing={isEditing} 
          />
        </div>

        <FormActions 
          onCancel={onCancel} 
          isSubmitting={isSubmitting} 
          submitLabel={submitLabel} 
        />
      </form>
    </Form>
  );
};

export default ContactForm;
