
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactService } from "@/services/contacts";
import { ContactStatus } from "@/types/database/enums";
import { toast } from "sonner";
import { contactSchema, ContactFormValues } from "../schema/contactFormSchema";

interface UseContactFormProps {
  onSuccess?: () => void;
}

export function useContactForm({ onSuccess }: UseContactFormProps = {}) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      address: "",
      notes: "",
      status: "lead" as ContactStatus,
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
        status: data.status as ContactStatus
      };
      
      const result = await contactService.createContact(contactData);
      if (result) {
        toast.success("Contact ajouté avec succès");
        form.reset();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du contact:", error);
      toast.error("Erreur lors de l'ajout du contact");
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit)
  };
}
