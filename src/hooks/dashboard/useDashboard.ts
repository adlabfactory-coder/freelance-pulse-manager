
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useRealtimeSubscriptions } from "./useRealtimeSubscriptions";
import { useDashboardStats } from "./useDashboardStats";
import { useDashboardActivities } from "./useDashboardActivities";
import { useDashboardTasks } from "./useDashboardTasks";
import { UseDashboardDataReturn } from "./types";

export function useDashboard(): UseDashboardDataReturn {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
  const { stats, dataSources, fetchStats } = useDashboardStats();
  const { activities, fetchActivities } = useDashboardActivities();
  const { tasks, fetchTasks } = useDashboardTasks();

  const fetchDashboardData = useCallback(async () => {
    // Si nous sommes déjà en train de rafraîchir, ne pas lancer une autre requête
    if (refreshing) return;
    
    console.log("Début de la récupération des données du tableau de bord");
    setRefreshing(true);
    try {
      // Récupérer toutes les données du tableau de bord
      const results = await Promise.allSettled([
        fetchStats(),
        fetchActivities(),
        fetchTasks()
      ]);
      
      // Vérifier si au moins les statistiques ont été récupérées avec succès
      const statsResult = results[0];
      if (statsResult.status === 'fulfilled') {
        console.log("Statistiques récupérées avec succès");
        setIsConnected(true);
        setLastUpdated(new Date());
        setRetryCount(0);
      } else {
        // Si l'échec est dû à un problème de connexion, incrémenter le compteur d'essais
        console.error("Erreur lors du chargement des statistiques:", statsResult.reason);
        setIsConnected(false);
        setRetryCount(prev => prev + 1);
        
        // Notification d'erreur après échec
        if (retryCount >= 3) {
          toast.error("Impossible de se connecter au serveur après plusieurs tentatives.", {
            description: "Veuillez vérifier votre connexion et actualiser manuellement."
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données du tableau de bord:", error);
      toast.error("Impossible de charger les données du tableau de bord.");
      setIsConnected(false);
    } finally {
      console.log("Fin de la récupération des données du tableau de bord");
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchStats, fetchActivities, fetchTasks, refreshing, retryCount]);

  // S'abonner aux mises à jour en temps réel mais ne pas les utiliser pour actualiser automatiquement
  useRealtimeSubscriptions(fetchDashboardData);

  // Charger les données au montage du composant, mais pas d'actualisation automatique périodique
  useEffect(() => {
    fetchDashboardData();
    // Pas de setInterval ici pour l'actualisation automatique
  }, [fetchDashboardData]);

  return {
    stats,
    activities,
    tasks,
    loading,
    refreshing,
    lastUpdated,
    isConnected,
    dataSources,
    fetchDashboardData
  };
}

// Pour assurer la compatibilité avec le code existant
export { useDashboard as useDashboardData };
