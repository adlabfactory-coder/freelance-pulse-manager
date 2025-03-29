
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ContactStatusBadge from "./ContactStatusBadge";
import { ContactFormValues } from "./schema/contactFormSchema";
import { ContactStatus } from "@/types/database/enums";

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormValues>;
  isEditing?: boolean;
}

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({ 
  form, 
  isEditing = false 
}) => {
  const renderRequiredField = (
    name: keyof ContactFormValues,
    label: string,
    placeholder: string,
    type: string = "text"
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label} *</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderOptionalField = (
    name: keyof ContactFormValues,
    label: string,
    placeholder: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <>
      {renderRequiredField("name", "Nom", "Jean Dupont")}
      {renderRequiredField("email", "Email", "jean.dupont@example.com", "email")}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderRequiredField("phone", "Téléphone", "06 12 34 56 78")}
        {renderOptionalField("company", "Entreprise", "Entreprise SARL")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderOptionalField("position", "Poste", "Directeur commercial")}

        {isEditing ? (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <FormControl>
                  <div className="h-10 px-3 py-2 flex items-center">
                    <ContactStatusBadge status={field.value as ContactStatus} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormItem>
            <FormLabel>Statut</FormLabel>
            <div className="h-10 px-3 py-2 flex items-center bg-gray-100 rounded-md border">
              <ContactStatusBadge status={ContactStatus.LEAD} />
              <span className="ml-2 text-sm text-muted-foreground">(Automatique)</span>
            </div>
          </FormItem>
        )}
      </div>

      {renderOptionalField("address", "Adresse", "123 rue de Paris, 75001 Paris")}

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Informations complémentaires..." 
                className="resize-none min-h-24" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ContactFormFields;
