
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormValues } from "@/components/contacts/schema/contactFormSchema";
import { addContact, updateContact } from "@/services/contacts/contact-create-update";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Contact } from "@/services/contacts/types";
import { supabase } from "@/lib/supabase-client";

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
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      position: initialData?.position || "",
      address: initialData?.address || "",
      status: initialData?.status || "lead",
      notes: initialData?.notes || "",
      assignedTo: initialData?.assignedTo || user?.id || "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Vérifie que l'utilisateur est connecté
      if (!user || !user.id) {
        toast.error("Erreur", {
          description: "Vous devez être connecté pour effectuer cette action"
        });
        return;
      }

      // Vérifier la session Supabase
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.warn("Pas de session Supabase active, mais un utilisateur est trouvé dans le contexte React");
        toast.error("Problème d'authentification", {
          description: "Veuillez vous reconnecter pour continuer"
        });
        return;
      }
      
      // Assurez-vous que l'ID utilisateur est un UUID valide
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(user.id)) {
        console.error("L'ID utilisateur n'est pas un UUID valide:", user.id);
        toast.error("Erreur", {
          description: "Identifiant utilisateur invalide, veuillez vous reconnecter"
        });
        return;
      }
      
      // Définir assignedTo avec l'ID de l'utilisateur connecté
      const contactData = {
        ...data,
        assignedTo: user.id,
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
