
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactCreateUpdateService, ContactFormInput } from '@/services/contacts/contact-create-update';
import { ContactStatus } from '@/types/database/enums';
import { contactSchema, ContactFormValues } from '@/components/contacts/schema/contactFormSchema';
import { useAuth } from '@/hooks/use-auth';

interface UseContactFormProps {
  onSuccess?: (contactData?: {id: string, name: string}) => void;
  initialData?: Partial<ContactFormValues & { id?: string }>;
  isEditing?: boolean;
}

// Export as a named export to match the import in components
export const useContactForm = ({ onSuccess, initialData, isEditing = false }: UseContactFormProps = {}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Add react-hook-form integration
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      position: initialData?.position || "",
      address: initialData?.address || "",
      notes: initialData?.notes || "",
      status: initialData?.status || "lead" as ContactStatus,
      assignedTo: initialData?.assignedTo || (user ? user.id : ""),
      folder: initialData?.folder || "general"
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Form submission handler
  const onSubmit = async (data: ContactFormValues) => {
    try {
      setLoading(true);
      
      // S'assurer que toutes les données requises sont présentes
      const contactInput: ContactFormInput = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        position: data.position,
        address: data.address,
        notes: data.notes,
        status: data.status as ContactStatus,
        assignedTo: data.assignedTo || (user ? user.id : undefined),
        folder: data.folder
      };
      
      console.log("Préparation données contact:", contactInput);
      
      if (isEditing && initialData?.id) {
        const success = await contactCreateUpdateService.updateContact(initialData.id, contactInput);
        if (success) {
          toast.success("Contact mis à jour avec succès");
          if (onSuccess) onSuccess({id: initialData.id, name: data.name});
        }
      } else {
        const contactId = await contactCreateUpdateService.createContact(contactInput);
        if (contactId) {
          toast.success("Contact ajouté avec succès");
          form.reset();
          if (onSuccess) onSuccess({id: contactId, name: data.name});
        }
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout/mise à jour du contact:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    loading
  };
};

// Also export as default to maintain backward compatibility
export default useContactForm;
