
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import ContactFormFields from "./ContactFormFields";
import { ContactFormValues } from "./schema/contactFormSchema";

interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditing: boolean;
  submitLabel: string;
  onCancel?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  form,
  isSubmitting,
  onSubmit,
  isEditing,
  submitLabel,
  onCancel
}) => {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <ContactFormFields form={form} isEditing={isEditing} />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
