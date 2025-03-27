
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
      
      // Si l'utilisateur n'est pas connecté, utiliser la fonction RPC qui contourne les RLS
      if (!user) {
        console.error("Utilisateur non authentifié lors de la création d'un contact");
        throw new Error("Vous devez être connecté pour créer un contact");
      }
      
      console.log("Création de contact avec utilisateur authentifié:", user.id);
      
      // Assurer que assignedTo est défini correctement
      const assignedTo = contactData.assignedTo || user.id;
      
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
          status: contactData.status,
          createdAt: now,
          updatedAt: now
        }
      });

      if (error) {
        console.error("Error creating contact:", error);
        throw error;
      }

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
      
      // Récupérer l'utilisateur actuellement connecté
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("Erreur d'authentification:", authError);
        throw new Error("Problème d'authentification");
      }
      
      const user = authData?.user;
      
      if (!user) {
        console.error("Utilisateur non authentifié lors de la mise à jour d'un contact");
        throw new Error("Vous devez être connecté pour mettre à jour un contact");
      }
      
      // Utiliser une insertion directe avec les RLS en place
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
          updatedAt: now
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating contact:", error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error in updateContact:", error);
      throw error;
    }
  }
};

// Export both methods for use elsewhere
export const { createContact, addContact, updateContact } = contactCreateUpdateService;
