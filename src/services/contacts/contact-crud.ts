import { supabase } from '@/lib/supabase';
import { Contact, ContactFormInput, ContactInsert, ContactUpdate } from './types';
import { toast } from '@/components/ui/use-toast';
import { ContactStatus } from '@/types/database/enums';

// Utility function to convert string status to enum type
const ensureContactStatus = (status: string | ContactStatus): ContactStatus => {
  const validStatuses: ContactStatus[] = ['lead', 'prospect', 'negotiation', 'signed', 'lost'];
  return validStatuses.includes(status as ContactStatus) 
    ? (status as ContactStatus) 
    : 'lead';
};

export const createContact = async (data: ContactFormInput): Promise<Contact | null> => {
  try {
    // Ensure status is a valid enum value
    const typedStatus = ensureContactStatus(data.status);
    
    const contactData: ContactInsert = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      position: data.position || null,
      address: data.address || null,
      notes: data.notes || null,
      status: typedStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { data: insertedContact, error } = await supabase
      .from('contacts')
      .insert(contactData)
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create contact. Please try again.",
      });
      return null;
    }

    toast({
      title: "Contact Created",
      description: `${data.name} has been added to your contacts.`,
    });

    return {
      ...insertedContact,
      createdAt: new Date(insertedContact.createdAt || Date.now()),
      updatedAt: new Date(insertedContact.updatedAt || Date.now()),
      status: insertedContact.status as ContactStatus
    };
  } catch (error) {
    console.error('Unexpected error creating contact:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
    });
    return null;
  }
};

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

export const updateContact = async (id: string, data: Partial<ContactFormInput>): Promise<boolean> => {
  try {
    const updateData: ContactUpdate = {
      ...data,
      // Ensure status is typed correctly if it exists
      ...(data.status && { status: ensureContactStatus(data.status) }),
      updatedAt: new Date().toISOString()
    };

    const { error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating contact:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update contact. Please try again.",
      });
      return false;
    }

    toast({
      title: "Contact Updated",
      description: "Contact information has been updated.",
    });

    return true;
  } catch (error) {
    console.error('Unexpected error updating contact:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
    });
    return false;
  }
};

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
        title: "Error",
        description: "Failed to delete contact. Please try again.",
      });
      return false;
    }

    toast({
      title: "Contact Deleted",
      description: "Contact has been removed from your contacts.",
    });

    return true;
  } catch (error) {
    console.error("Error in deleteContact:", error);
    return false;
  }
};

export const fetchContacts = getContacts;

export const contactCrudService = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  fetchContacts,
};
