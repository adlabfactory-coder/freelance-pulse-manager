
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactService } from "@/services/contacts";
import { ContactStatus } from "@/types/database/enums";
import { toast } from "sonner";
import { contactSchema, ContactFormValues } from "../schema/contactFormSchema";
import { Contact } from "@/services/contacts/types";

interface UseContactFormProps {
  onSuccess?: (contactData?: {id: string, name: string}) => void;
  initialData?: Partial<ContactFormValues & { id?: string }>;
  isEditing?: boolean;
}

export function useContactForm({ onSuccess, initialData, isEditing = false }: UseContactFormProps = {}) {
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
      assignedTo: initialData?.assignedTo || ""
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: ContactFormValues) {
    try {
      const contactData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || "",
        position: data.position || "",
        address: data.address || "",
        notes: data.notes || "",
        // Toujours définir le statut à "lead" lors de la création d'un nouveau contact
        status: isEditing ? data.status as ContactStatus : "lead" as ContactStatus,
        assignedTo: data.assignedTo
      };
      
      let result;
      if (isEditing && initialData?.id) {
        result = await contactService.updateContact(initialData.id, contactData);
        if (result) {
          toast.success("Contact mis à jour avec succès");
        }
      } else {
        result = await contactService.createContact(contactData);
        if (result) {
          toast.success("Contact ajouté avec succès");
          form.reset();
        }
      }
      
      if (result && onSuccess) {
        // Pass both id and name to onSuccess callback
        const contactInfo = {
          id: typeof result === 'string' ? result : initialData?.id || '',
          name: data.name
        };
        onSuccess(contactInfo);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout/mise à jour du contact:", error);
      toast.error("Erreur lors de l'opération sur le contact");
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit)
  };
}
