
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getMockUsers } from '@/utils/supabase-mock-data';
import { checkSupabaseConnection } from '@/lib/supabase';

/**
 * Récupère tous les utilisateurs depuis Supabase avec meilleure gestion des erreurs
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    console.log("🔄 Tentative de récupération des utilisateurs depuis Supabase");
    
    // Vérification de l'état de la connexion Supabase
    let shouldUseMockData = false;
    
    try {
      const connectionStatus = await checkSupabaseConnection();
      if (!connectionStatus.success) {
        console.warn("⚠️ Erreur lors de la vérification de la connexion:", connectionStatus.message);
        shouldUseMockData = true;
      }
    } catch (error) {
      console.warn("⚠️ Exception lors de la vérification de la connexion:", error);
      shouldUseMockData = true;
    }
    
    // Utiliser des données de démo si la connexion a échoué
    if (shouldUseMockData) {
      console.info("ℹ️ Utilisation des données de démo pour les utilisateurs");
      return getMockUsers();
    }
    
    // La connexion est établie, on tente de récupérer les utilisateurs
    try {
      console.log("🔄 Exécution de la requête Supabase");
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.warn("⚠️ Erreur Supabase lors de la récupération des utilisateurs:", error.message);
        throw new Error(`Erreur de récupération: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        console.warn("⚠️ Aucun utilisateur trouvé dans Supabase, utilisation des données de démo");
        return getMockUsers();
      }
      
      console.log(`✅ Récupération réussie: ${data.length} utilisateurs`);
      
      return data.map(user => ({
        ...user,
        role: user.role as UserRole
      })) as User[];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
      throw new Error(`Erreur de récupération: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  } catch (error) {
    console.error('❌ Erreur fatale lors de la récupération des utilisateurs:', error);
    return getMockUsers();
  }
};
