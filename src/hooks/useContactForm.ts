
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactService } from '@/services/contact-service';
import { ContactStatus } from '@/types/database/enums';
import { contactSchema, ContactFormValues } from '@/components/contacts/schema/contactFormSchema';
import { useAuth } from '@/hooks/use-auth';
import { accountManagerService } from '@/services/account-manager/account-manager-service';

interface UseContactFormProps {
  onSuccess?: (contactData?: {id: string, name: string}) => void;
  initialData?: Partial<ContactFormValues & { id?: string }>;
  isEditing?: boolean;
  useAutoAssign?: boolean;
}

export const useContactForm = ({ 
  onSuccess, 
  initialData, 
  isEditing = false,
  useAutoAssign = false
}: UseContactFormProps = {}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
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
      status: initialData?.status || ContactStatus.LEAD,
      assignedTo: initialData?.assignedTo || "",
      folder: initialData?.folder || "general"
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setLoading(true);
      
      // Si l'utilisateur n'a pas assigné de chargé de compte et que l'auto-assignation est activée
      if (!data.assignedTo && useAutoAssign) {
        const nextManager = await accountManagerService.getNextAvailableAccountManager();
        if (nextManager) {
          data.assignedTo = nextManager.id;
          console.log("Contact auto-assigné au chargé de compte:", nextManager.name);
          toast.success(`Contact auto-assigné à ${nextManager.name}`);
        } else {
          toast.error("Aucun chargé de compte disponible pour l'auto-assignation");
          setLoading(false);
          return;
        }
      }
      
      // Vérifier que l'utilisateur a bien assigné un chargé de compte
      if (!data.assignedTo) {
        toast.error("Vous devez assigner ce contact à un chargé de compte");
        setLoading(false);
        return;
      }
      
      const contactInput = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        position: data.position,
        address: data.address,
        notes: data.notes,
        status: data.status as ContactStatus,
        assignedTo: data.assignedTo,
        folder: data.folder
      };
      
      if (isEditing && initialData?.id) {
        const updatedContact = await contactService.updateContact(initialData.id, contactInput);
        if (updatedContact) {
          toast.success("Contact mis à jour avec succès");
          if (onSuccess) onSuccess({id: initialData.id, name: data.name});
        }
      } else {
        const contactId = await contactService.createContact(contactInput);
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
