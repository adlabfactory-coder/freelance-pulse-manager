
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
        .eq('role', UserRole.ACCOUNT_MANAGER);

      if (userError) {
        console.error("Erreur lors de la récupération des chargés de compte:", userError);
        return [];
      }

      // Récupérer le nombre de contacts assignés à chaque chargé de compte
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('assignedTo');

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
      return stats.sort((a, b) => b.contactCount - a.contactCount);
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération des statistiques:", error);
      return [];
    }
  }

  async getNextAvailableAccountManager(): Promise<User | null> {
    try {
      const stats = await this.getDistributionStats();
      
      if (stats.length === 0) {
        return null;
      }
      
      // Trouver le chargé de compte avec le moins de contacts
      return stats.sort((a, b) => a.contactCount - b.contactCount)[0].manager;
    } catch (error) {
      console.error("Erreur lors de la recherche du prochain chargé de compte disponible:", error);
      return null;
    }
  }
}

export const accountManagerService = new AccountManagerService();
