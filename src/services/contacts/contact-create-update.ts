
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Contact, ContactFormInput } from "./types";

// Service pour la création et la mise à jour des contacts
export const contactCreateUpdateService = {
  /**
   * Crée un nouveau contact
   */
  createContact: async (contactData: ContactFormInput): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert(contactData)
        .select('id')
        .single();

      if (error) {
        console.error('Erreur lors de la création du contact:', error);
        toast.error("Erreur lors de la création du contact: " + error.message);
        return null;
      }

      return data?.id || null;
    } catch (error: any) {
      console.error('Erreur lors de la création du contact:', error);
      toast.error("Erreur inattendue lors de la création du contact");
      return null;
    }
  },

  /**
   * Ajoute un nouveau contact (alias pour rétrocompatibilité)
   */
  addContact: async (contactData: ContactFormInput): Promise<string | null> => {
    return contactCreateUpdateService.createContact(contactData);
  },

  /**
   * Met à jour un contact existant
   */
  updateContact: async (id: string, contactData: Partial<ContactFormInput>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          ...contactData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour du contact:', error);
        toast.error("Erreur lors de la mise à jour du contact: " + error.message);
        return false;
      }

      toast.success("Contact mis à jour avec succès");
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du contact:', error);
      toast.error("Erreur inattendue lors de la mise à jour du contact");
      return false;
    }
  }
};

// Export individual functions for backward compatibility
export const addContact = contactCreateUpdateService.addContact;
export const updateContact = contactCreateUpdateService.updateContact;
