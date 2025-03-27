
import { supabase } from '@/lib/supabase-client';
import { Contact } from './types';
import { toast } from 'sonner';
import { UserRole } from '@/types';

export const contactOperationsService = {
  async getContacts(userId?: string, userRole?: string, includeDeleted: boolean = false): Promise<Contact[]> {
    try {
      console.log("🔄 Récupération des contacts...", { userId, userRole, includeDeleted });
      
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

  async getContactsByFreelancer(freelancerId: string): Promise<Contact[]> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('assignedTo', freelancerId)
        .not('folder', 'eq', 'trash')
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
