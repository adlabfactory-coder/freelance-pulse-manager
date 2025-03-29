
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "./schema/contactFormSchema";
import { useAuth } from "@/hooks/use-auth";
import ContactFormFields from "./form/ContactFormFields";
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
}

const ContactForm: React.FC<ContactFormProps> = ({
  form,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditing = false,
  submitLabel = "Soumettre"
}) => {
  const { user } = useAuth();
  const [useAutoAssign, setUseAutoAssign] = useState(false);
  
  // Si l'utilisateur crée un nouveau contact, on l'assigne automatiquement comme propriétaire
  React.useEffect(() => {
    if (!isEditing && user) {
      form.setValue('createdBy', user.id);
    }
  }, [user, isEditing, form]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <ContactFormFields form={form} />

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
