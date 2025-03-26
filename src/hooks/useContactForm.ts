
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormValues } from "@/components/contacts/schema/contactFormSchema";
import { addContact, updateContact } from "@/services/contacts/contact-create-update";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Contact } from "@/services/contacts/types";

interface UseContactFormProps {
  initialData?: Partial<Contact>;
  onSuccess?: () => void;
  isEditing: boolean;
}

export const useContactForm = ({ initialData, onSuccess, isEditing }: UseContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      address: "",
      status: "lead",
      notes: "",
      // Important: Make sure user.id is a valid UUID
      assignedTo: user?.id || "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Ensure we have a valid user ID - if user.id doesn't exist, don't proceed
      if (!user?.id) {
        toast.error("Erreur", {
          description: "Vous devez être connecté pour effectuer cette action"
        });
        return;
      }
      
      // Make sure we use the actual UUID from the auth user
      const contactData = {
        ...data,
        assignedTo: user.id, // Use the actual UUID here
      };
      
      console.log("Données de contact à soumettre:", contactData);

      if (isEditing && initialData?.id) {
        console.log("Mise à jour du contact existant avec ID:", initialData.id);
        await updateContact(initialData.id, contactData);
        toast.success("Contact mis à jour avec succès");
      } else {
        console.log("Création d'un nouveau contact");
        await addContact(contactData);
        toast.success("Contact ajouté avec succès");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du contact:", error);
      toast.error("Erreur", {
        description: error.message || "Une erreur est survenue"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
