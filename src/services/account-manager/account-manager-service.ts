
import { User, UserRole } from '@/types';
import { supabase } from '@/lib/supabase-client';

interface DistributionStat {
  manager: User;
  contactCount: number;
}

class AccountManagerService {
  async getDistributionStats(): Promise<DistributionStat[]> {
    try {
      // Récupérer tous les chargés de compte
      const { data: accountManagers, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('role', UserRole.ACCOUNT_MANAGER)
        .is('deleted_at', null); // Ignorer les utilisateurs supprimés

      if (userError) {
        console.error("Erreur lors de la récupération des chargés de compte:", userError);
        return [];
      }

      // Récupérer le nombre de contacts assignés à chaque chargé de compte
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('assignedTo')
        .is('deleted_at', null); // Ignorer les contacts supprimés

      if (contactsError) {
        console.error("Erreur lors de la récupération des contacts:", contactsError);
        return [];
      }

      // Compter le nombre de contacts par chargé de compte
      const contactCounts: Record<string, number> = {};
      contacts.forEach(contact => {
        if (contact.assignedTo) {
          contactCounts[contact.assignedTo] = (contactCounts[contact.assignedTo] || 0) + 1;
        }
      });

      // Créer les statistiques de distribution
      const stats: DistributionStat[] = accountManagers.map(manager => ({
        manager: manager as User,
        contactCount: contactCounts[manager.id] || 0
      }));

      // Trier par nombre de contacts (décroissant)
      return stats.sort((a, b) => a.contactCount - b.contactCount);
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération des statistiques:", error);
      return [];
    }
  }

  async getNextAvailableAccountManager(): Promise<User | null> {
    try {
      const stats = await this.getDistributionStats();
      
      if (stats.length === 0) {
        console.warn("Aucun chargé de compte disponible pour l'assignation automatique");
        return null;
      }
      
      // Trouver le chargé de compte avec le moins de contacts
      const selectedManager = stats[0].manager;
      console.log("Chargé de compte sélectionné pour l'assignation automatique:", 
        selectedManager.name, "avec", stats[0].contactCount, "contacts");
      
      return selectedManager;
    } catch (error) {
      console.error("Erreur lors de la recherche du prochain chargé de compte disponible:", error);
      return null;
    }
  }

  // Méthode alias pour maintenir la compatibilité avec le code existant
  async getNextAccountManager(): Promise<User | null> {
    return this.getNextAvailableAccountManager();
  }
}

export const accountManagerService = new AccountManagerService();
