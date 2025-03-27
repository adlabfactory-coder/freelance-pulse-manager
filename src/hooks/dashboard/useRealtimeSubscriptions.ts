
import { useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { enableDashboardRealtime } from "@/services/dashboard/enable-realtime";

export function useRealtimeSubscriptions(
  fetchDashboardData: () => Promise<void>
): void {
  // Configurer les écouteurs pour les mises à jour en temps réel
  useEffect(() => {
    let channels: any[] = [];

    const setupRealtime = async () => {
      try {
        // Activer la fonctionnalité Realtime pour le tableau de bord
        const result = await enableDashboardRealtime();
        
        if (result.success && result.channels) {
          channels = result.channels;
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation du Realtime:", error);
      }
    };

    // Appeler la fonction de configuration
    setupRealtime();

    // Nettoyer les canaux à la suppression du composant
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [fetchDashboardData]);
}
