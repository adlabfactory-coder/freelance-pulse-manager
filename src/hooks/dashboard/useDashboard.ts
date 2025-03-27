
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
  const [shouldRefresh, setShouldRefresh] = useState(true);
  
  const { stats, dataSources, fetchStats } = useDashboardStats();
  const { activities, fetchActivities } = useDashboardActivities();
  const { tasks, fetchTasks } = useDashboardTasks();

  const fetchDashboardData = useCallback(async () => {
    // Si nous sommes déjà en train de rafraîchir, ne pas lancer une autre requête
    if (refreshing) return;
    
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
        setIsConnected(true);
        setLastUpdated(new Date());
        setRetryCount(0);
      } else {
        // Si l'échec est dû à un problème de connexion, incrémenter le compteur d'essais
        console.error("Erreur lors du chargement des statistiques:", statsResult.reason);
        setIsConnected(false);
        setRetryCount(prev => prev + 1);
        
        // Après 3 essais infructueux, arrêter les tentatives automatiques
        if (retryCount >= 3) {
          setShouldRefresh(false);
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
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchStats, fetchActivities, fetchTasks, refreshing, retryCount]);

  // S'abonner aux mises à jour en temps réel
  useRealtimeSubscriptions(fetchDashboardData);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchDashboardData();
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
export { useDashboard as useDashboardData } from './useDashboard';
