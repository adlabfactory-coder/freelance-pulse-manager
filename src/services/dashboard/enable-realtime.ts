
import { supabase } from "@/lib/supabase";

// Variable globale pour suivre l'état d'activation
let isRealtimeEnabled = false;
let activeChannels: any[] = [];

/**
 * Active la fonctionnalité Realtime pour les tables du tableau de bord
 */
export const enableDashboardRealtime = async () => {
  try {
    // Si déjà activé, retourner les canaux existants
    if (isRealtimeEnabled && activeChannels.length > 0) {
      return { success: true, channels: activeChannels };
    }
    
    // Tables à surveiller pour le tableau de bord
    const dashboardTables = [
      'appointments',
      'quotes',
      'commissions',
      'contacts'
      // 'tasks' - commenté car la table n'existe pas encore
    ];
    
    // Créer des canaux pour chaque table et s'abonner
    const channels = dashboardTables.map(table => {
      return supabase.channel(`realtime-${table}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table }, 
          (payload) => {
            console.log(`Changement détecté dans ${table}:`, payload);
            // Note: Le traitement des événements est géré dans useRealtimeSubscriptions
          }
        )
        .subscribe((status) => {
          console.log(`Canal ${table} status:`, status);
        });
    });
    
    // Mettre à jour les variables globales
    isRealtimeEnabled = true;
    activeChannels = channels;
    
    return { success: true, channels };
  } catch (error) {
    console.error("Erreur lors de l'activation du Realtime pour le tableau de bord:", error);
    return { success: false, error };
  }
};

/**
 * Désactive tous les canaux Realtime actifs
 */
export const disableDashboardRealtime = () => {
  if (activeChannels.length > 0) {
    activeChannels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    activeChannels = [];
    isRealtimeEnabled = false;
    return { success: true };
  }
  return { success: false, message: "Aucun canal Realtime actif" };
};
