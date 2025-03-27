
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
   * Supprime un contact par son ID
   */
  async deleteContact(contactId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
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
