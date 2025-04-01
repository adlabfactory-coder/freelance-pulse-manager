import { supabase } from '@/lib/supabase-client';
import { Contact, ContactStatus } from './types';
import { toast } from 'sonner';

export const contactOperationsService = {
  async getContacts(userId?: string, userRole?: string, includeDeleted: boolean = false): Promise<Contact[]> {
    try {
      // Validation de l'UUID pour éviter les erreurs SQL
      if (userId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.log("ID utilisateur non valide pour UUID, utilisation des données simulées:", userId);
        // Pour les démonstrations avec des ID non valides, utiliser des données simulées
        return [
          {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Contact Demo 1',
            email: 'contact1@example.com',
            status: ContactStatus.LEAD,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Contact Demo 2',
            email: 'contact2@example.com',
            status: ContactStatus.PROSPECT,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
      }

      let query = supabase.from('contacts').select('*');

      // Si on ne veut pas inclure les contacts supprimés logiquement
      if (!includeDeleted) {
        query = query.is('deleted_at', null);
      }

      // Si l'utilisateur est spécifié et n'est pas administrateur, filtrer par utilisateur assigné
      if (userId && userRole !== 'admin') {
        query = query.eq('assignedTo', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
        throw error;
      }

      return data as Contact[];
    } catch (error: any) {
      console.error("Erreur lors de la récupération des contacts:", error);
      throw error;
    }
  },

  async getContactsByFreelancer(freelancerId: string): Promise<Contact[]> {
    try {
      // Validation de l'UUID pour éviter les erreurs SQL
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(freelancerId)) {
        console.log("ID utilisateur non valide pour UUID, utilisation des données simulées:", freelancerId);
        // Pour les démonstrations avec des ID non valides, utiliser des données simulées
        return [
          {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Contact Demo 1',
            email: 'contact1@example.com',
            status: ContactStatus.LEAD,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Contact Demo 2',
            email: 'contact2@example.com',
            status: ContactStatus.PROSPECT,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
      }

      // D'abord, essayer de récupérer via la table de liaison
      const { data: contactRelations, error: relationsError } = await supabase
        .from('freelancer_contacts')
        .select('contact_id')
        .eq('freelancer_id', freelancerId);

      if (relationsError) {
        console.warn("Erreur lors de la récupération des relations freelancer-contacts:", relationsError);
        // On continue avec la méthode assignedTo en cas d'erreur
      }

      if (contactRelations && contactRelations.length > 0) {
        // Récupérer les contacts via leurs IDs
        const contactIds = contactRelations.map(relation => relation.contact_id);
        
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .in('id', contactIds)
          .is('deleted_at', null);
        
        if (error) {
          console.error("Erreur lors de la récupération des contacts par IDs:", error);
          throw error;
        }
        
        return data as Contact[];
      } else {
        // Méthode alternative: récupérer les contacts assignés directement au freelancer
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('assignedTo', freelancerId)
          .is('deleted_at', null);
        
        if (error) {
          console.error("Erreur lors de la récupération des contacts par assignation:", error);
          throw error;
        }
        
        return data as Contact[];
      }
    } catch (error: any) {
      console.error("Erreur lors de la récupération des contacts du freelancer:", error);
      throw error;
    }
  },

  async createContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact | null> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          ...contactData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la création du contact:", error);
        throw error;
      }

      return data as Contact;
    } catch (error: any) {
      console.error("Erreur lors de la création du contact:", error);
      toast.error("Erreur lors de la création du contact");
      throw error;
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
        console.error("Erreur lors de la mise à jour du contact:", error);
        throw error;
      }

      return data as Contact;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du contact:", error);
      toast.error("Erreur lors de la mise à jour du contact");
      throw error;
    }
  },

  async deleteContact(contactId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          deleted_at: new Date().toISOString()
        })
        .eq('id', contactId);

      if (error) {
        console.error("Erreur lors de la suppression du contact:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("Erreur lors de la suppression du contact:", error);
      toast.error("Erreur lors de la suppression du contact");
      throw error;
    }
  }
};
