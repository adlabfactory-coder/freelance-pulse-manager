
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormValues } from "@/components/contacts/schema/contactFormSchema";
import { addContact, updateContact } from "@/services/contacts/contact-create-update";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Contact } from "@/services/contacts/types";

interface UseContactFormProps {
  initialData?: Contact;
  onSuccess?: () => void;
  isEditing: boolean;
}

export const useContactForm = ({ initialData, onSuccess, isEditing }: UseContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      address: "",
      status: "lead",
      notes: "",
      // Important: nous définissons toujours assignedTo à l'ID de l'utilisateur actuel
      // car c'est requis par les politiques RLS
      assignedTo: user?.id || "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Assurons-nous que assignedTo est toujours défini avec l'utilisateur actuel
      const contactData = {
        ...data,
        assignedTo: user?.id || "",
      };
      
      console.log("Données de contact à soumettre:", contactData);

      if (isEditing && initialData) {
        console.log("Mise à jour du contact existant avec ID:", initialData.id);
        await updateContact(initialData.id, contactData);
        toast("Contact mis à jour avec succès");
      } else {
        console.log("Création d'un nouveau contact");
        await addContact(contactData);
        toast("Contact ajouté avec succès");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du contact:", error);
      toast("Erreur", {
        description: error.message || "Une erreur est survenue",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
};
