
/**
 * Basic CRUD operations for contacts
 */
import { supabase } from '@/lib/supabase-client';
import { Contact, ContactInsert, ContactUpdate } from './types';
import { toast } from 'sonner';
import { ContactStatus } from '@/types/database/enums';
import { useAuth } from '@/hooks/use-auth';

/**
 * Service for basic contact operations
 */
export const contactOperationsService = {
  /**
   * Récupère la liste des contacts depuis Supabase
   * Si l'utilisateur est un freelancer, ne retourne que ses contacts
   * Si l'utilisateur est un admin ou un chargé de compte, retourne tous les contacts
   */
  async getContacts(userId?: string, userRole?: string): Promise<Contact[]> {
    try {
      let query = supabase
        .from('contacts')
        .select('*')
        .is('deleted_at', null)
        .order('createdAt', { ascending: false });
      
      // Si l'utilisateur est un freelancer, filtrer par assignedTo
      if (userRole === 'freelancer' && userId) {
        query = query.eq('assignedTo', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erreur lors de la récupération des contacts:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
      return [];
    }
  },

  /**
   * Récupère un contact spécifique par son ID
   */
  async getContactById(contactId: string): Promise<Contact | null> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', contactId)
        .is('deleted_at', null)
        .single();
      
      if (error) {
        console.error(`Erreur lors de la récupération du contact ${contactId}:`, error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du contact ${contactId}:`, error);
      return null;
    }
  },

  /**
   * Récupère les contacts assignés à un freelancer spécifique
   */
  async getContactsByFreelancer(freelancerId: string): Promise<Contact[]> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('assignedTo', freelancerId)
        .is('deleted_at', null)
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error(`Erreur lors de la récupération des contacts du freelancer ${freelancerId}:`, error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des contacts du freelancer ${freelancerId}:`, error);
      return [];
    }
  },

  /**
   * Met à jour un contact
   */
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
        console.error(`Erreur lors de la mise à jour du contact ${contactId}:`, error);
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

  /**
   * Supprime un contact par son ID (suppression logique)
   */
  async deleteContact(contactId: string): Promise<boolean> {
    try {
      // Utilisation de la suppression logique en définissant deleted_at
      const { error } = await supabase
        .from('contacts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', contactId);
      
      if (error) {
        console.error(`Erreur lors de la suppression du contact ${contactId}:`, error);
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
