
import { supabase } from "@/lib/supabase-client";
import { ContactStatus } from "@/types/database/enums";

// Define input type for contact creation/update
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
  // Create a new contact
  async createContact(contactData: ContactFormInput): Promise<string | null> {
    try {
      const now = new Date().toISOString();
      
      // Récupérer l'utilisateur actuellement connecté
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("Erreur d'authentification:", authError);
        throw new Error("Problème d'authentification");
      }
      
      const user = authData?.user;
      
      // Assurer que assignedTo est défini correctement
      const assignedTo = contactData.assignedTo || (user ? user.id : null);
      const folder = contactData.folder || 'general';
      
      console.log("Création de contact avec données:", {
        name: contactData.name,
        email: contactData.email,
        assignedTo: assignedTo,
        folder: folder
      });
      
      // Utiliser une procédure stockée ou une fonction RPC pour insérer le contact
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
        console.error("Error creating contact:", error);
        throw error;
      }

      console.log("Contact created successfully:", data);
      return data?.id || null;
    } catch (error) {
      console.error("Error in createContact:", error);
      throw error;
    }
  },

  // Alias for createContact (for backward compatibility)
  async addContact(contactData: ContactFormInput): Promise<string | null> {
    return this.createContact(contactData);
  },

  // Update an existing contact
  async updateContact(id: string, contactData: Partial<ContactFormInput>): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      
      console.log("Mise à jour de contact:", id, contactData);
      
      // Direct update without RLS since we disabled it
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
        console.error("Error updating contact:", error);
        throw error;
      }

      console.log("Contact updated successfully:", id);
      return true;
    } catch (error) {
      console.error("Error in updateContact:", error);
      throw error;
    }
  }
};

// Export both methods for use elsewhere
export const { createContact, addContact, updateContact } = contactCreateUpdateService;
