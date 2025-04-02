
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
import { useContactDuplicateCheck } from "@/hooks/useContactDuplicateCheck";
import { toast } from "sonner";

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
  const { validateUniqueness, checkingCompleted, hasDuplicateErrors } = useContactDuplicateCheck(form, contactId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Vérifier s'il y a des erreurs dans le formulaire
    const hasFormErrors = Object.keys(form.formState.errors).length > 0;
    if (hasFormErrors) {
      toast.error("Le formulaire contient des erreurs", {
        description: "Veuillez corriger les erreurs avant de soumettre le formulaire."
      });
      return;
    }
    
    // Vérifier l'unicité avant soumission
    const isUnique = await validateUniqueness();
    
    if (!isUnique) {
      toast.error("Doublon détecté", {
        description: "Cette adresse email ou ce numéro de téléphone est déjà utilisé par un autre contact."
      });
      return;
    }
    
    // Si tout est valide, soumettre le formulaire
    onSubmit(e);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
          isSubmitting={isSubmitting || !checkingCompleted}
          submitLabel={submitLabel}
          disabled={hasDuplicateErrors || !checkingCompleted}
        />
      </form>
    </Form>
  );
};

export default ContactForm;
