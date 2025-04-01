
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactService } from '@/services/contact-service';
import { ContactStatus } from '@/types/database/enums';
import { contactSchema, ContactFormValues } from '@/components/contacts/schema/contactFormSchema';
import { useAuth } from '@/hooks/use-auth';
import { accountManagerService } from '@/services/account-manager/account-manager-service';
import { Contact } from '@/services/contacts/types';

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
        try {
          const nextManager = await accountManagerService.getNextAvailableAccountManager();
          if (nextManager) {
            data.assignedTo = nextManager.id;
            console.log("Contact auto-assigné au chargé de compte:", nextManager.name);
            toast.success(`Contact auto-assigné à ${nextManager.name}`);
          } else {
            console.warn("Aucun chargé de compte disponible pour l'auto-assignation");
            toast.warning("Aucun chargé de compte disponible pour l'auto-assignation");
          }
        } catch (error) {
          console.error("Erreur lors de l'auto-assignation:", error);
          toast.error("Erreur lors de l'auto-assignation du contact");
        }
      }
      
      // Vérifier que l'utilisateur a bien assigné un chargé de compte si requis
      // Commenté car peut être optionnel selon votre logique métier
      // if (!data.assignedTo) {
      //   toast.warning("Vous devez assigner ce contact à un chargé de compte");
      //   setLoading(false);
      //   return;
      // }
      
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
        try {
          const updated = await contactService.updateContact(initialData.id, contactInput);
          if (updated) {
            if (onSuccess) onSuccess({id: initialData.id, name: data.name});
          }
        } catch (error: any) {
          // Les erreurs sont déjà gérées dans le service, nous n'interférons pas
          console.error("Erreur lors de la mise à jour du contact:", error);
        }
      } else {
        try {
          const createdContact = await contactService.createContact(contactInput);
          if (createdContact) {
            form.reset();
            if (onSuccess) onSuccess({id: createdContact.id, name: data.name});
          }
        } catch (error: any) {
          // Les erreurs sont déjà gérées dans le service, nous n'interférons pas
          console.error("Erreur lors de la création du contact:", error);
        }
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout/mise à jour du contact:", error);
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
