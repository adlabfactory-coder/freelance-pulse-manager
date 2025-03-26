
/**
 * Service for creating and updating contacts
 */
import { supabase } from '@/lib/supabase-client';
import { Contact, ContactInsert, ContactUpdate } from './types';
import { toast } from 'sonner';
import { ContactStatus } from '@/types/database/enums';

export const contactCreateUpdateService = {
  /**
   * Ajoute un nouveau contact dans Supabase
   */
  async addContact(contactData: ContactInsert): Promise<Contact | null> {
    try {
      // Assurez-vous que le statut est du type ContactStatus
      const contact = {
        ...contactData,
        status: (contactData.status || 'lead') as ContactStatus
      };
      
      const { data, error } = await supabase
        .from('contacts')
        .insert(contact)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de l\'ajout du contact:', error);
        throw error;
      }
      
      toast.success("Contact ajouté", {
        description: `${contact.name} a été ajouté avec succès.`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du contact:', error);
      
      toast.error("Erreur", {
        description: `Impossible d'ajouter le contact: ${error.message}`,
      });
      
      return null;
    }
  },

  /**
   * Crée un nouveau contact (alias pour addContact pour compatibilité)
   */
  async createContact(contactData: ContactInsert): Promise<Contact | null> {
    return this.addContact(contactData);
  },

  /**
   * Met à jour les informations d'un contact
   */
  async updateContact(contactId: string, contactData: ContactUpdate): Promise<Contact | null> {
    try {
      // Assurez-vous que le statut est du type ContactStatus si présent
      const contact = {
        ...contactData,
        ...(contactData.status && { status: contactData.status as ContactStatus })
      };
      
      const { data, error } = await supabase
        .from('contacts')
        .update(contact)
        .eq('id', contactId)
        .select()
        .single();
      
      if (error) {
        console.error(`Erreur lors de la mise à jour du contact ${contactId}:`, error);
        throw error;
      }
      
      toast.success("Contact mis à jour", {
        description: "Les informations du contact ont été mises à jour avec succès.",
      });
      
      return data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du contact ${contactId}:`, error);
      
      toast.error("Erreur", {
        description: `Impossible de mettre à jour le contact: ${error.message}`,
      });
      
      return null;
    }
  }
};
