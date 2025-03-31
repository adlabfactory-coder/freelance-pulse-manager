import { supabase } from '@/lib/supabase-client';
import { Contact } from './types';
import { toast } from 'sonner';
import { UserRole } from '@/types';
import { getMockUsers } from '@/utils/supabase-mock-data';

export const contactOperationsService = {
  async getContacts(userId?: string, userRole?: string, includeDeleted: boolean = false): Promise<Contact[]> {
    try {
      console.log("🔄 Récupération des contacts...", { userId, userRole, includeDeleted });
      
      // Vérification de l'ID utilisateur pour éviter les erreurs SQL
      const isValidUUID = userId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) : false;
      
      // Si l'ID n'est pas valide et que c'est un freelance démo, retourner des données fictives
      if (userId === 'freelancer-uuid' || (userId && !isValidUUID && userRole === 'freelancer')) {
        console.log("🔵 Utilisation de données de contacts simulées pour l'utilisateur démo", userId);
        // Retourner quelques contacts fictifs pour la démo
        return [
          {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Contact Demo 1',
            email: 'contact1@example.com',
            status: 'lead',
            assignedTo: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            folder: 'general'
          },
          {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Contact Demo 2',
            email: 'contact2@example.com',
            status: 'prospect',
            assignedTo: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            folder: 'general'
          }
        ];
      }
      
      // Si l'ID n'est pas un UUID valide, mais on a besoin de faire une requête à la BD
      if (userId && !isValidUUID) {
        console.warn("❌ ID utilisateur non valide pour UUID:", userId);
        throw new Error("ID utilisateur non valide");
      }
      
      let query = supabase
        .from('contacts')
        .select('*');
      
      // Si includeDeleted est false, ne pas récupérer les contacts dans le dossier "trash"
      if (!includeDeleted) {
        query = query.not('folder', 'eq', 'trash');
      }
      
      // Tri par date de création décroissante
      query = query.order('createdAt', { ascending: false });
      
      // Si l'utilisateur n'est ni admin ni super_admin, filtrer les contacts
      if (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN) {
        if (userRole === 'freelancer' && userId) {
          console.log("Filtrage des contacts pour le freelancer:", userId);
          query = query.eq('assignedTo', userId);
        } else if (userId) {
          // Pour d'autres rôles avec des restrictions
          query = query.eq('assignedTo', userId);
        }
      } else {
        console.log("Accès admin: récupération de tous les contacts");
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }
      
      console.log(`✅ ${data?.length || 0} contacts récupérés${includeDeleted ? ' (y compris dossier trash)' : ''}`);
      
      // Si aucun contact n'est récupéré, afficher un message de débogage
      if (!data || data.length === 0) {
        console.log("Aucun contact trouvé dans la table 'contacts'");
        
        // Vérifier si la table existe et a des données
        const { count, error: countError } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true });
          
        if (countError) {
          console.error("Erreur lors de la vérification de la table 'contacts':", countError);
        } else {
          console.log(`La table 'contacts' contient ${count} enregistrements au total`);
        }
      } else {
        // Afficher la répartition des contacts par dossier et par statut
        const trashCount = data.filter(contact => contact.folder === 'trash').length;
        console.log(`Répartition des contacts: ${trashCount} dans le dossier trash, ${data.length - trashCount} actifs`);
        
        // Afficher la répartition par statut
        const statusCounts = data.reduce((acc, contact) => {
          acc[contact.status] = (acc[contact.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log("Répartition par statut:", statusCounts);
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des contacts:', error);
      throw error;
    }
  },

  async getContactsByFreelancer(freelancerId: string): Promise<Contact[]> {
    try {
      // Validation d'UUID pour éviter les erreurs SQL
      const isValidUUID = freelancerId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(freelancerId) : false;
      
      // Cas spécial pour "freelancer-uuid" et autres ID non valides
      if (freelancerId === 'freelancer-uuid' || !isValidUUID) {
        console.log("Utilisation de données simulées pour le freelancer démo:", freelancerId);
        // Retourner des contacts fictifs pour la démo
        return [
          {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Contact Démo 1',
            email: 'contact1@example.com',
            status: 'lead',
            assignedTo: 'freelancer-uuid',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Contact Démo 2',
            email: 'contact2@example.com',
            status: 'prospect',
            assignedTo: 'freelancer-uuid',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
      }
      
      // D'abord, essayer de récupérer via la table freelancer_contacts
      const { data: contactRelations, error: relationsError } = await supabase
        .from('freelancer_contacts')
        .select('contact_id')
        .eq('freelancer_id', freelancerId);
      
      if (relationsError) {
        console.warn("Erreur lors de la récupération des relations freelancer-contacts:", relationsError);
      } else if (contactRelations && contactRelations.length > 0) {
        // Récupérer les contacts associés
        const contactIds = contactRelations.map(r => r.contact_id);
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select('*')
          .in('id', contactIds)
          .not('folder', 'eq', 'trash');
          
        if (contactsError) {
          console.error("Erreur lors de la récupération des contacts:", contactsError);
        } else {
          return contacts || [];
        }
      }
      
      // Méthode alternative: rechercher par assignedTo
      const { data: assignedContacts, error: assignedError } = await supabase
        .from('contacts')
        .select('*')
        .eq('assignedTo', freelancerId)
        .not('folder', 'eq', 'trash');
      
      if (assignedError) {
        console.error("Erreur lors de la récupération des contacts assignés:", assignedError);
        throw assignedError;
      }
      
      return assignedContacts || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des contacts du freelancer ${freelancerId}:`, error);
      return [];
    }
  },

  async getContactById(contactId: string): Promise<Contact | null> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', contactId)
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
      // Au lieu de marquer le contact comme supprimé avec deleted_at, 
      // nous le déplaçons dans le dossier 'trash'
      const { error } = await supabase
        .from('contacts')
        .update({ 
          folder: 'trash',
          updatedAt: new Date().toISOString()
        })
        .eq('id', contactId);
      
      if (error) {
        throw error;
      }
      
      toast.success("Contact supprimé", {
        description: "Le contact a été déplacé dans la corbeille.",
      });
      
      return true;
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du contact ${contactId}:`, error);
      
      toast.error("Erreur", {
        description: `Impossible de supprimer le contact: ${error.message}`,
      });
      
      return false;
    }
  },

  async restoreContact(contactId: string): Promise<boolean> {
    try {
      // Restaurer le contact en le déplaçant du dossier 'trash' vers 'general'
      const { error } = await supabase
        .from('contacts')
        .update({ 
          folder: 'general',
          updatedAt: new Date().toISOString()
        })
        .eq('id', contactId);
      
      if (error) {
        throw error;
      }
      
      toast.success("Contact restauré", {
        description: "Le contact a été restauré avec succès.",
      });
      
      return true;
    } catch (error: any) {
      console.error(`Erreur lors de la restauration du contact ${contactId}:`, error);
      
      toast.error("Erreur", {
        description: `Impossible de restaurer le contact: ${error.message}`,
      });
      
      return false;
    }
  },

  async permanentlyDeleteContact(contactId: string): Promise<boolean> {
    try {
      // Supprimer définitivement le contact de la base de données
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);
      
      if (error) {
        throw error;
      }
      
      toast.success("Contact supprimé définitivement", {
        description: "Le contact a été supprimé définitivement de la base de données.",
      });
      
      return true;
    } catch (error: any) {
      console.error(`Erreur lors de la suppression définitive du contact ${contactId}:`, error);
      
      toast.error("Erreur", {
        description: `Impossible de supprimer définitivement le contact: ${error.message}`,
      });
      
      return false;
    }
  }
};
