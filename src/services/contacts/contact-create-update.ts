
import { supabase } from "@/lib/supabase-client";
import { ContactStatus } from "@/types/database/enums";
import { toast } from "sonner";

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
        console.warn("Problème d'authentification (mode démo):", authError.message);
        // En mode démo, continuer malgré l'erreur d'authentification
      }
      
      const user = authData?.user;
      
      const assignedTo = contactData.assignedTo || (user ? user.id : null);
      const folder = contactData.folder || 'general';
      
      // Insérer directement dans la table contacts au lieu d'utiliser la fonction RPC
      const { data, error } = await supabase
        .from('contacts')
        .insert({
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
        })
        .select('id')
        .single();

      if (error) {
        console.error("Erreur lors de la création du contact:", error);
        throw error;
      }

      return data?.id || null;
    } catch (error: any) {
      console.error("Error in createContact:", error);
      toast.error("Erreur lors de la création du contact: " + error.message);
      throw error;
    }
  },

  async addContact(contactData: ContactFormInput): Promise<string | null> {
    return this.createContact(contactData);
  },

  async updateContact(id: string, contactData: Partial<ContactFormInput>): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      
      const updateData: any = {
        updatedAt: now
      };
      
      // Ajouter uniquement les champs définis
      if (contactData.name !== undefined) updateData.name = contactData.name;
      if (contactData.email !== undefined) updateData.email = contactData.email;
      if (contactData.phone !== undefined) updateData.phone = contactData.phone;
      if (contactData.company !== undefined) updateData.company = contactData.company;
      if (contactData.position !== undefined) updateData.position = contactData.position;
      if (contactData.address !== undefined) updateData.address = contactData.address;
      if (contactData.notes !== undefined) updateData.notes = contactData.notes;
      if (contactData.assignedTo !== undefined) updateData.assignedTo = contactData.assignedTo;
      if (contactData.status !== undefined) updateData.status = contactData.status;
      if (contactData.folder !== undefined) updateData.folder = contactData.folder;
      
      const { error } = await supabase
        .from("contacts")
        .update(updateData)
        .eq("id", id);

      if (error) {
        console.error("Erreur lors de la mise à jour du contact:", error);
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Error in updateContact:", error);
      toast.error("Erreur lors de la mise à jour du contact: " + error.message);
      throw error;
    }
  }
};

export const { createContact, addContact, updateContact } = contactCreateUpdateService;
