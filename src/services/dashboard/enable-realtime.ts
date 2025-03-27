
import { supabase } from "@/lib/supabase";

/**
 * Active la fonctionnalité Realtime pour les tables du tableau de bord
 */
export const enableDashboardRealtime = async () => {
  try {
    // Tables à surveiller pour le tableau de bord
    const dashboardTables = [
      'appointments',
      'quotes',
      'commissions',
      'contacts',
      'tasks'
    ];
    
    // Créer des canaux pour chaque table et s'abonner
    const channels = dashboardTables.map(table => {
      return supabase.channel(`realtime-${table}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table }, 
          (payload) => {
            console.log(`Changement détecté dans ${table}:`, payload);
          }
        )
        .subscribe();
    });
    
    return { success: true, channels };
  } catch (error) {
    console.error("Erreur lors de l'activation du Realtime pour le tableau de bord:", error);
    return { success: false, error };
  }
};
