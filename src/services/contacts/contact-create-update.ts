
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
      const { data, error } = await supabase
        .from("contacts")
        .insert([
          {
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone || null,
            company: contactData.company || null,
            position: contactData.position || null,
            address: contactData.address || null,
            notes: contactData.notes || null,
            assignedTo: contactData.assignedTo || null,
            status: contactData.status,
            createdAt: now,
            updatedAt: now
          }
        ])
        .select("id")
        .single();

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

  // Update an existing contact
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
