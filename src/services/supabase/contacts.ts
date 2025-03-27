
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Contact } from '@/types/contact';
import { ServiceResponse } from './types';
import { ContactStatus } from '@/types/database/enums';

export const createContactsService = (supabase: SupabaseClient<Database>) => {
  return {
    // Services pour les contacts
    fetchContacts: async (): Promise<Contact[]> => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .is('deleted_at', null);

      if (error) throw error;
      return data as Contact[];
    },
    
    // Ajout d'un contact avec statut initial "lead"
    addContact: async (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact | null> => {
      const contact = {
        ...contactData,
        status: 'lead' as ContactStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('contacts')
        .insert(contact)
        .select()
        .single();
        
      if (error) throw error;
      return data as Contact;
    },
    
    // Mise à jour d'un contact
    updateContact: async (contactId: string, contactData: Partial<Contact>): Promise<Contact | null> => {
      const { data, error } = await supabase
        .from('contacts')
        .update({
          ...contactData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', contactId)
        .select()
        .single();
        
      if (error) throw error;
      return data as Contact;
    },
    
    // Suppression logique d'un contact
    deleteContact: async (contactId: string): Promise<ServiceResponse> => {
      const { error } = await supabase
        .from('contacts')
        .update({
          deleted_at: new Date().toISOString()
        })
        .eq('id', contactId);
        
      if (error) throw error;
      return { success: true };
    }
  };
};
