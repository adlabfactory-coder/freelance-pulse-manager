
import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { enableDashboardRealtime, disableDashboardRealtime } from "@/services/dashboard/enable-realtime";

export function useRealtimeSubscriptions(
  fetchDashboardData: () => Promise<void>
): void {
  // Utiliser une référence pour stocker la dernière mise à jour
  const lastUpdateRef = useRef<number>(Date.now());
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fonction pour déclencher la mise à jour avec debounce
  const triggerUpdate = useCallback(() => {
    // Annuler tout délai précédent
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Vérifier si assez de temps s'est écoulé depuis la dernière mise à jour (au moins 5 secondes)
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;
    
    if (timeSinceLastUpdate < 5000) {
      // Si moins de 5 secondes se sont écoulées, programmer une mise à jour différée
      debounceTimeoutRef.current = setTimeout(() => {
        fetchDashboardData();
        lastUpdateRef.current = Date.now();
      }, 5000 - timeSinceLastUpdate);
    } else {
      // Sinon, mettre à jour immédiatement
      fetchDashboardData();
      lastUpdateRef.current = now;
    }
  }, [fetchDashboardData]);

  // Configurer les écouteurs pour les mises à jour en temps réel
  useEffect(() => {
    const setupRealtime = async () => {
      try {
        // Activer la fonctionnalité Realtime pour le tableau de bord
        const result = await enableDashboardRealtime();
        
        if (!result.success) {
          console.error("Échec de l'activation du Realtime:", result.error);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation du Realtime:", error);
      }
    };

    // Appeler la fonction de configuration
    setupRealtime();

    // Configurer un gestionnaire d'événements global pour les changements Supabase
    const handleRealtimeChange = () => {
      triggerUpdate();
    };

    // S'abonner aux événements personnalisés pour les mises à jour Realtime
    window.addEventListener('supabase-realtime-update', handleRealtimeChange);

    // Nettoyer les canaux et les écouteurs à la suppression du composant
    return () => {
      disableDashboardRealtime();
      window.removeEventListener('supabase-realtime-update', handleRealtimeChange);
      
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [fetchDashboardData, triggerUpdate]);
}
