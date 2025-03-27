
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
  
  const { stats, dataSources, setDataSources, fetchStats } = useDashboardStats();
  const { activities, fetchActivities } = useDashboardActivities();
  const { tasks, fetchTasks } = useDashboardTasks();

  const fetchDashboardData = useCallback(async () => {
    setRefreshing(true);
    try {
      // Récupérer toutes les données du tableau de bord
      await Promise.all([
        fetchStats(),
        fetchActivities(),
        fetchTasks()
      ]);

      setIsConnected(true);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erreur lors du chargement des données du tableau de bord:", error);
      toast.error("Impossible de charger les données du tableau de bord.");
      setIsConnected(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchStats, fetchActivities, fetchTasks]);

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
