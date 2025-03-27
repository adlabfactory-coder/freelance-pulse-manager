
import { supabase } from "@/lib/supabase-client";
import { User, UserRole } from "@/types";
import { toast } from "sonner";
import { fetchAccountManagers } from "@/services/user/fetch-users";

/**
 * Service pour gérer l'attribution équitable des chargés de compte
 */
export const accountManagerService = {
  /**
   * Obtient le prochain chargé de compte selon une distribution équitable
   * Utilise un algorithme qui attribue les contacts au chargé de compte
   * ayant le moins de contacts à gérer
   */
  async getNextAccountManager(): Promise<User | null> {
    try {
      console.log("🔄 Recherche du prochain chargé de compte disponible...");
      
      // 1. Récupérer tous les chargés de compte
      const accountManagers = await fetchAccountManagers();
      
      if (!accountManagers || accountManagers.length === 0) {
        console.warn("❌ Aucun chargé de compte disponible dans le système");
        return null;
      }
      
      console.log(`✅ ${accountManagers.length} chargés de compte trouvés`);
      
      // 2. Pour chaque chargé de compte, compter le nombre de contacts assignés
      const managerLoads = await Promise.all(
        accountManagers.map(async (manager) => {
          const { count, error } = await supabase
            .from('contacts')
            .select('*', { count: 'exact', head: true })
            .eq('assignedTo', manager.id)
            .not('folder', 'eq', 'trash');
          
          if (error) {
            console.error(`Erreur lors du comptage des contacts pour ${manager.name}:`, error);
            return { manager, count: 0 };
          }
          
          return { 
            manager, 
            count: count || 0 
          };
        })
      );
      
      // 3. Trier les chargés de compte par nombre de contacts (ascendant)
      managerLoads.sort((a, b) => a.count - b.count);
      
      // 4. Retourner le chargé de compte avec le moins de contacts
      const nextManager = managerLoads[0]?.manager || null;
      
      if (nextManager) {
        console.log(`✅ Chargé de compte sélectionné: ${nextManager.name} (${nextManager.id}) avec ${managerLoads[0].count} contacts`);
      } else {
        console.warn("❌ Impossible de déterminer le prochain chargé de compte");
      }
      
      return nextManager;
    } catch (error) {
      console.error("❌ Erreur lors de la sélection du prochain chargé de compte:", error);
      return null;
    }
  },
  
  /**
   * Récupère des statistiques sur la distribution des contacts
   * entre les chargés de compte
   */
  async getDistributionStats(): Promise<{
    manager: User;
    contactCount: number;
  }[]> {
    try {
      // Récupérer tous les chargés de compte
      const accountManagers = await fetchAccountManagers();
      
      if (!accountManagers || accountManagers.length === 0) {
        return [];
      }
      
      // Pour chaque chargé de compte, compter le nombre de contacts assignés
      const stats = await Promise.all(
        accountManagers.map(async (manager) => {
          const { count, error } = await supabase
            .from('contacts')
            .select('*', { count: 'exact', head: true })
            .eq('assignedTo', manager.id)
            .not('folder', 'eq', 'trash');
          
          if (error) {
            console.error(`Erreur lors du comptage des contacts pour ${manager.name}:`, error);
            return { manager, contactCount: 0 };
          }
          
          return { 
            manager, 
            contactCount: count || 0 
          };
        })
      );
      
      // Trier par nombre de contacts (descendant)
      return stats.sort((a, b) => b.contactCount - a.contactCount);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques de distribution:", error);
      return [];
    }
  }
};
