
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ContactStatusSelector from "../ContactStatusSelector";
import { ContactFormValues } from "../schema/contactFormSchema";

interface StatusSelectorProps {
  form: UseFormReturn<ContactFormValues>;
  isEditing: boolean;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ form, isEditing }) => {
  if (!isEditing) return null;
  
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Statut</FormLabel>
          <ContactStatusSelector
            value={field.value}
            onChange={field.onChange}
            currentStatus={field.value}
            onStatusChange={field.onChange}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StatusSelector;
