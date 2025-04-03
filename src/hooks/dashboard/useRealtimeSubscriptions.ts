
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase"; // Import standardisé

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
        // Créer un canal unique avec un ID aléatoire pour éviter les conflits
        const channelId = `dashboard-${Math.random().toString(36).substring(2, 10)}`;
        
        // Créer les canaux pour les tables principales
        const channel = supabase.channel(channelId)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'appointments' },
            () => {
              console.log('Changements détectés sur appointments');
              fetchDataRef.current();
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'quotes' },
            () => {
              console.log('Changements détectés sur quotes');
              fetchDataRef.current();
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'commissions' },
            () => {
              console.log('Changements détectés sur commissions');
              fetchDataRef.current();
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'contacts' },
            () => {
              console.log('Changements détectés sur contacts');
              fetchDataRef.current();
            }
          )
          .subscribe((status) => {
            console.log(`Canal Realtime status: ${status}`);
          });
          
        return channel;
      } catch (error) {
        console.error("Erreur lors de l'initialisation du Realtime:", error);
        return null;
      }
    };

    // Appeler la fonction de configuration et stocker le canal
    let channel: any;
    setupRealtime().then(ch => {
      channel = ch;
    });

    // Nettoyer le canal à la suppression du composant
    return () => {
      if (channel) {
        console.log("Suppression du canal Realtime");
        supabase.removeChannel(channel);
      }
    };
  }, []);
}
