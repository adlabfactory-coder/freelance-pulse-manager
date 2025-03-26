
import { supabase } from "@/lib/supabase";
import { Contact } from "@/types";
import { ContactStatus } from "@/types/database/enums";
import { toast } from "sonner";

// Créer un nouveau contact
export const createContact = async (
  contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<Contact | null> => {
  try {
    // Toujours définir le statut initial comme "lead"
    const newContact = {
      ...contactData,
      status: 'lead' as ContactStatus,
    };

    const { data, error } = await supabase
      .from('contacts')
      .insert(newContact)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du contact:', error);
      toast.error(`Erreur lors de la création du contact: ${error.message}`);
      return null;
    }

    toast.success('Contact créé avec succès');
    return data as Contact;
  } catch (err) {
    console.error('Erreur inattendue lors de la création du contact:', err);
    toast.error('Une erreur inattendue est survenue lors de la création du contact');
    return null;
  }
};

// Mettre à jour un contact existant
export const updateContact = async (
  id: string,
  contactData: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Contact | null> => {
  try {
    const updates = {
      ...contactData,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du contact:', error);
      toast.error(`Erreur lors de la mise à jour du contact: ${error.message}`);
      return null;
    }

    toast.success('Contact mis à jour avec succès');
    return data as Contact;
  } catch (err) {
    console.error('Erreur inattendue lors de la mise à jour du contact:', err);
    toast.error('Une erreur inattendue est survenue lors de la mise à jour du contact');
    return null;
  }
};
