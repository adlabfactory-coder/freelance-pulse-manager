
import { supabase } from '@/lib/supabase-client';
import { Contact, ContactStatus } from './types';
import { toast } from 'sonner';

export const contactOperationsService = {
  // Récupérer tous les contacts avec gestion des rôles
  async getContacts(userId?: string, userRole?: string, includeDeleted: boolean = false): Promise<Contact[]> {
    try {
      let query = supabase
        .from('contacts')
        .select('*');

      if (!includeDeleted) {
        query = query.is('deleted_at', null);
      }

      // Filtrer par utilisateur si celui-ci est un freelance
      if (userId && userRole === 'freelancer') {
        query = query.eq('assignedTo', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
        throw error;
      }

      return data as Contact[];
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
      return [];
    }
  },

  // Récupérer les contacts d'un freelancer spécifique
  async getContactsByFreelancer(freelancerId: string): Promise<Contact[]> {
    try {
      // D'abord, on regarde dans la table freelancer_contacts
      const { data: contactRelations, error: relationsError } = await supabase
        .from('freelancer_contacts')
        .select('contact_id')
        .eq('freelancer_id', freelancerId);

      if (relationsError) {
        console.error("Erreur lors de la récupération des relations:", relationsError);
        throw relationsError;
      }

      if (contactRelations && contactRelations.length > 0) {
        const contactIds = contactRelations.map(relation => relation.contact_id);
        
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select('*')
          .in('id', contactIds)
          .is('deleted_at', null);

        if (contactsError) {
          console.error("Erreur lors de la récupération des contacts:", contactsError);
          throw contactsError;
        }

        return contacts as Contact[];
      }

      // Sinon, on utilise le champ assignedTo
      const { data: assignedContacts, error: assignedError } = await supabase
        .from('contacts')
        .select('*')
        .eq('assignedTo', freelancerId)
        .is('deleted_at', null);

      if (assignedError) {
        console.error("Erreur lors de la récupération des contacts assignés:", assignedError);
        throw assignedError;
      }

      return assignedContacts as Contact[];
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts du freelancer:", error);
      return [];
    }
  },

  // Get contact by ID
  async getContactById(contactId: string): Promise<Contact | null> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', contactId)
        .is('deleted_at', null)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du contact:", error);
        return null;
      }

      return data as Contact;
    } catch (error) {
      console.error("Erreur lors de la récupération du contact:", error);
      return null;
    }
  },

  // Mettre à jour un contact
  async updateContact(contactId: string, contactData: Partial<Contact>): Promise<Contact | null> {
    try {
      // Supprimer l'ID du contact des données de mise à jour si présent
      const { id, ...updateData } = contactData;

      const { data, error } = await supabase
        .from('contacts')
        .update({ ...updateData, updatedAt: new Date().toISOString() })
        .eq('id', contactId)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour du contact:", error);
        throw error;
      }

      return data as Contact;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contact:", error);
      return null;
    }
  },

  // Supprimer un contact (logiquement)
  async deleteContact(contactId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', contactId);

      if (error) {
        console.error("Erreur lors de la suppression du contact:", error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error);
      return false;
    }
  },

  // Restaurer un contact
  async restoreContact(contactId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ deleted_at: null })
        .eq('id', contactId);

      if (error) {
        console.error("Erreur lors de la restauration du contact:", error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la restauration du contact:", error);
      return false;
    }
  },

  // Supprimer définitivement un contact
  async permanentlyDeleteContact(contactId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        console.error("Erreur lors de la suppression définitive du contact:", error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression définitive du contact:", error);
      return false;
    }
  }
};
