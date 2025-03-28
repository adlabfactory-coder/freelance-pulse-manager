
import { useEffect, useRef } from "react";
import { enableDashboardRealtime, disableDashboardRealtime } from "@/services/dashboard/enable-realtime";

export function useRealtimeSubscriptions(
  fetchDashboardData: () => Promise<void>
): void {
  // Utiliser une référence pour stocker la fonction de récupération des données
  const fetchDataRef = useRef(fetchDashboardData);
  
  // Mettre à jour la référence lorsque la fonction change
  useEffect(() => {
    fetchDataRef.current = fetchDashboardData;
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

    // Dans cette version, nous n'ajoutons plus de gestionnaire d'événements
    // pour déclencher automatiquement les mises à jour

    // Nettoyer les canaux à la suppression du composant
    return () => {
      disableDashboardRealtime();
    };
  }, []);
}
