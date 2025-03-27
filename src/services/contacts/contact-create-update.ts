
import { supabase } from "@/lib/supabase-client";
import { ContactStatus } from "@/types/database/enums";

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  status: ContactStatus;
  assignedTo?: string;
  folder?: string;
}

export const contactCreateUpdateService = {
  async createContact(contactData: ContactFormInput): Promise<string | null> {
    try {
      const now = new Date().toISOString();
      
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error("Problème d'authentification");
      }
      
      const user = authData?.user;
      
      const assignedTo = contactData.assignedTo || (user ? user.id : null);
      const folder = contactData.folder || 'general';
      
      const { data, error } = await supabase.rpc('create_contact', {
        contact_data: {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || null,
          company: contactData.company || null,
          position: contactData.position || null,
          address: contactData.address || null,
          notes: contactData.notes || null,
          assignedTo: assignedTo,
          status: contactData.status || 'lead',
          createdAt: now,
          updatedAt: now,
          folder: folder
        }
      });

      if (error) {
        throw error;
      }

      return data?.id || null;
    } catch (error) {
      console.error("Error in createContact:", error);
      throw error;
    }
  },

  async addContact(contactData: ContactFormInput): Promise<string | null> {
    return this.createContact(contactData);
  },

  async updateContact(id: string, contactData: Partial<ContactFormInput>): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from("contacts")
        .update({
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || null,
          company: contactData.company || null,
          position: contactData.position || null,
          address: contactData.address || null,
          notes: contactData.notes || null,
          assignedTo: contactData.assignedTo || null,
          status: contactData.status,
          folder: contactData.folder || 'general',
          updatedAt: now
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error in updateContact:", error);
      throw error;
    }
  }
};

export const { createContact, addContact, updateContact } = contactCreateUpdateService;
