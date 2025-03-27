import { supabase } from '@/lib/supabase-client';
import { Contact } from './types';
import { toast } from 'sonner';

export const contactOperationsService = {
  async getContacts(userId?: string, userRole?: string): Promise<Contact[]> {
    try {
      console.log("🔄 Récupération des contacts...", { userId, userRole });
      
      let query = supabase
        .from('contacts')
        .select('*')
        .is('deleted_at', null)
        .order('createdAt', { ascending: false });
      
      if (userRole === 'freelancer' && userId) {
        console.log("Filtrage des contacts pour le freelancer:", userId);
        query = query.eq('assignedTo', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }
      
      console.log(`✅ ${data?.length || 0} contacts récupérés`);
      return data || [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des contacts:', error);
      return [];
    }
  },

  async getContactById(contactId: string): Promise<Contact | null> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', contactId)
        .is('deleted_at', null)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du contact ${contactId}:`, error);
      return null;
    }
  },

  async getContactsByFreelancer(freelancerId: string): Promise<Contact[]> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('assignedTo', freelancerId)
        .is('deleted_at', null)
        .order('createdAt', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des contacts du freelancer ${freelancerId}:`, error);
      return [];
    }
  },

  async updateContact(contactId: string, contactData: Partial<Contact>): Promise<Contact | null> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({
          ...contactData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', contactId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success("Contact mis à jour", {
        description: "Le contact a été mis à jour avec succès.",
      });
      
      return data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du contact ${contactId}:`, error);
      
      toast.error("Erreur", {
        description: `Impossible de mettre à jour le contact: ${error.message}`,
      });
      
      return null;
    }
  },

  async deleteContact(contactId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', contactId);
      
      if (error) {
        throw error;
      }
      
      toast.success("Contact supprimé", {
        description: "Le contact a été supprimé avec succès.",
      });
      
      return true;
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du contact ${contactId}:`, error);
      
      toast.error("Erreur", {
        description: `Impossible de supprimer le contact: ${error.message}`,
      });
      
      return false;
    }
  }
};
