
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactCreateUpdateService, ContactFormInput } from '@/services/contacts/contact-create-update';
import { ContactStatus } from '@/types/database/enums';
import { contactSchema, ContactFormValues } from '@/components/contacts/schema/contactFormSchema';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';

interface UseContactFormProps {
  onSuccess?: (contactData?: {id: string, name: string}) => void;
  initialData?: Partial<ContactFormValues & { id?: string }>;
  isEditing?: boolean;
}

export const useContactForm = ({ onSuccess, initialData, isEditing = false }: UseContactFormProps = {}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Déterminer le freelancer assigné par défaut
  const defaultAssignedTo = initialData?.assignedTo || (user?.role === 'freelancer' ? user?.id : '');
  
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
      assignedTo: defaultAssignedTo || "",
      folder: initialData?.folder || "general"
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setLoading(true);
      
      // Vérifier que l'utilisateur a bien assigné un freelancer
      if (!data.assignedTo) {
        toast.error("Vous devez assigner ce contact à un freelancer");
        setLoading(false);
        return;
      }
      
      const contactInput: ContactFormInput = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        position: data.position,
        address: data.address,
        notes: data.notes,
        status: data.status as ContactStatus,
        assignedTo: data.assignedTo, // Maintenant obligatoire
        folder: data.folder
      };
      
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

export default useContactForm;
