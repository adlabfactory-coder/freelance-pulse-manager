
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useContactForm } from "./hooks/useContactForm";
import ContactFormFields from "./ContactFormFields";

interface AddContactFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddContactForm({ onSuccess, onCancel }: AddContactFormProps) {
  const { form, isSubmitting, onSubmit } = useContactForm({ onSuccess });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <ContactFormFields form={form} />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Ajouter le contact"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AddContactForm;
