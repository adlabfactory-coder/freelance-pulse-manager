
import { supabase } from "@/lib/supabase-client";
import { ContactStatus } from "@/types/database/enums";
import { toast } from "@/components/ui/use-toast";
import { Contact, ContactFormInput, ContactInsert } from "./types";

// Fetching all contacts
export const getContacts = async (): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }

    // Convert database records to our Contact type
    return data.map((record) => ({
      id: record.id,
      name: record.name,
      email: record.email,
      phone: record.phone || undefined,
      company: record.company || undefined,
      position: record.position || undefined,
      address: record.address || undefined,
      notes: record.notes || undefined,
      assignedTo: record.assignedTo || undefined,
      status: record.status as ContactStatus,
      subscriptionPlanId: record.subscription_plan_id || undefined,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    }));
  } catch (error) {
    console.error("Error in getContacts:", error);
    return [];
  }
};

// Function to fetch a single contact by ID
export const getContactById = async (id: string): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      console.error("Error fetching contact:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      company: data.company || undefined,
      position: data.position || undefined,
      address: data.address || undefined,
      notes: data.notes || undefined,
      assignedTo: data.assignedTo || undefined,
      status: data.status as ContactStatus,
      subscriptionPlanId: data.subscription_plan_id || undefined,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  } catch (error) {
    console.error("Error in getContactById:", error);
    return null;
  }
};

// Creating a new contact
export const createContact = async (contactData: ContactFormInput): Promise<Contact | null> => {
  try {
    const newContact: ContactInsert = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || null,
      company: contactData.company || null,
      position: contactData.position || null,
      address: contactData.address || null,
      notes: contactData.notes || null,
      status: contactData.status,
    };

    const { data, error } = await supabase
      .from("contacts")
      .insert(newContact)
      .select()
      .single();

    if (error) {
      console.error("Error creating contact:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le contact."
      });
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      company: data.company || undefined,
      position: data.position || undefined,
      address: data.address || undefined,
      notes: data.notes || undefined,
      assignedTo: data.assignedTo || undefined,
      status: data.status as ContactStatus,
      subscriptionPlanId: data.subscription_plan_id || undefined,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  } catch (error) {
    console.error("Error in createContact:", error);
    return null;
  }
};

// Updating an existing contact
export const updateContact = async (id: string, contactData: Partial<ContactFormInput>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("contacts")
      .update(contactData)
      .eq("id", id);

    if (error) {
      console.error("Error updating contact:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le contact."
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateContact:", error);
    return false;
  }
};

// Deleting a contact
export const deleteContact = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting contact:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le contact."
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteContact:", error);
    return false;
  }
};

// Alias for getContacts for backward compatibility
export const fetchContacts = getContacts;

// Export all CRUD functions
export const contactCrudService = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  fetchContacts,
};
