
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useRealtimeSubscriptions } from "./useRealtimeSubscriptions";
import { useDashboardStats } from "./useDashboardStats";
import { useDashboardActivities } from "./useDashboardActivities";
import { useDashboardTasks } from "./useDashboardTasks";
import { UseDashboardDataReturn } from "./types";
import { useAuth } from "@/hooks/use-auth";

export function useDashboard(): UseDashboardDataReturn {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  
  const { stats, dataSources, fetchStats } = useDashboardStats();
  const { activities, fetchActivities } = useDashboardActivities();
  const { tasks, fetchTasks } = useDashboardTasks();

  // Annuler les requêtes en cours lors du démontage
  useEffect(() => {
    return () => {
      if (abortController) {
        console.log("Annulation des requêtes en cours lors du démontage du dashboard");
        abortController.abort();
      }
    };
  }, [abortController]);

  const fetchDashboardData = useCallback(async () => {
    // Vérifier si l'utilisateur est authentifié
    if (!isAuthenticated) {
      console.log("Utilisateur non authentifié, impossible de récupérer les données du tableau de bord");
      return;
    }
    
    // Si nous sommes déjà en train de rafraîchir, annuler la requête précédente
    if (refreshing && abortController) {
      console.log("Annulation de la requête précédente");
      abortController.abort();
    }
    
    // Créer un nouveau AbortController pour cette requête
    const newController = new AbortController();
    setAbortController(newController);
    
    console.log("Début de la récupération des données du tableau de bord");
    setRefreshing(true);
    
    try {
      // Récupérer toutes les données du tableau de bord en parallèle
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
        
        // Notification d'erreur après plusieurs échecs
        if (retryCount >= 2) {
          toast.error("Impossible de se connecter au serveur après plusieurs tentatives.", {
            description: "Veuillez vérifier votre connexion et actualiser manuellement."
          });
        }
      }
    } catch (error) {
      // Ignorer les erreurs d'annulation
      if (error && (error as Error).name === 'AbortError') {
        console.log("Requête annulée");
        return;
      }
      
      console.error("Erreur lors du chargement des données du tableau de bord:", error);
      setIsConnected(false);
    } finally {
      console.log("Fin de la récupération des données du tableau de bord");
      setLoading(false);
      setRefreshing(false);
      // Nettoyer l'AbortController après la fin de la requête
      setAbortController(null);
    }
  }, [fetchStats, fetchActivities, fetchTasks, refreshing, retryCount, isAuthenticated]);

  // S'abonner aux mises à jour en temps réel
  useRealtimeSubscriptions(fetchDashboardData);

  // Charger les données au montage du composant, mais une seule fois
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]); // Dépendance à isAuthenticated uniquement

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
