
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export interface DashboardStats {
  pendingContracts: number;
  commissions: number;
  scheduledAppointments: number;
  clients: number;
}

export interface DashboardActivity {
  title: string;
  date: string;
  type: string;
}

export interface DataSource {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSynced?: Date;
}

export function useDashboardData() {
  const { user, isFreelancer, isAccountManager, isAdminOrSuperAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    pendingContracts: 0,
    commissions: 0,
    scheduledAppointments: 0,
    clients: 0
  });
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(true);
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { name: 'Contrats', status: 'connected', lastSynced: new Date() },
    { name: 'Commissions', status: 'connected', lastSynced: new Date() },
    { name: 'Rendez-vous', status: 'connected', lastSynced: new Date() },
    { name: 'Clients', status: 'connected', lastSynced: new Date() }
  ]);
  
  const fetchDashboardData = useCallback(async () => {
    setRefreshing(true);
    try {
      // Requêtes de base communes à tous les rôles
      let pendingContractsQuery = supabase
        .from('quotes')
        .select('count', { count: 'exact' })
        .eq('status', 'sent');
        
      let appointmentsQuery = supabase
        .from('appointments')
        .select('count', { count: 'exact' })
        .eq('status', 'scheduled');
        
      // Filtrer selon le rôle de l'utilisateur
      if (isFreelancer && user?.id) {
        pendingContractsQuery = pendingContractsQuery.eq('freelancerId', user.id);
        appointmentsQuery = appointmentsQuery.eq('freelancerId', user.id);
      } else if (isAccountManager && user?.id) {
        // Pour les chargés de compte, montrer tous les contrats et rendez-vous
        // Logique spécifique si nécessaire
      }
      
      // Exécuter les requêtes
      const [contractsResult, appointmentsResult] = await Promise.all([
        pendingContractsQuery,
        appointmentsQuery
      ]);

      // Mettre à jour les statuts des sources de données
      const newDataSources = [...dataSources];
      newDataSources[0].status = contractsResult.error ? 'error' : 'connected';
      newDataSources[2].status = appointmentsResult.error ? 'error' : 'connected';
      newDataSources[0].lastSynced = new Date();
      newDataSources[2].lastSynced = new Date();
      
      // Requêtes spécifiques selon le rôle
      let commissionsValue = 0;
      let clientsCount = 0;
      
      if (isFreelancer && user?.id) {
        // Récupérer les commissions du freelancer
        const { data: commissionsData, error: commissionsError } = await supabase
          .from('commissions')
          .select('amount')
          .eq('freelancerId', user.id)
          .eq('status', 'pending');
          
        if (!commissionsError && commissionsData) {
          commissionsValue = commissionsData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
          newDataSources[1].status = 'connected';
        } else {
          newDataSources[1].status = commissionsError ? 'error' : 'disconnected';
        }
        newDataSources[1].lastSynced = new Date();
        
        // Récupérer les clients assignés au freelancer
        const { count: contactsCount, error: contactsError } = await supabase
          .from('contacts')
          .select('count', { count: 'exact' })
          .eq('assignedTo', user.id);
          
        clientsCount = contactsCount || 0;
        newDataSources[3].status = contactsError ? 'error' : 'connected';
        newDataSources[3].lastSynced = new Date();
      } else {
        // Pour les admins et chargés de compte, montrer toutes les commissions et clients
        const { data: commissionsData, error: commissionsError } = await supabase
          .from('commissions')
          .select('amount')
          .eq('status', 'pending');
          
        if (!commissionsError && commissionsData) {
          commissionsValue = commissionsData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
          newDataSources[1].status = 'connected';
        } else {
          newDataSources[1].status = commissionsError ? 'error' : 'disconnected';
        }
        newDataSources[1].lastSynced = new Date();
        
        const { count: contactsCount, error: contactsError } = await supabase
          .from('contacts')
          .select('count', { count: 'exact' });
          
        clientsCount = contactsCount || 0;
        newDataSources[3].status = contactsError ? 'error' : 'connected';
        newDataSources[3].lastSynced = new Date();
      }

      setDataSources(newDataSources);
      
      // Récupérer les activités récentes
      let recentActivitiesQuery = supabase
        .from('appointments')
        .select('title, date, status')
        .order('date', { ascending: false })
        .limit(5);
        
      if (isFreelancer && user?.id) {
        recentActivitiesQuery = recentActivitiesQuery.eq('freelancerId', user.id);
      }
      
      const { data: recentActivities } = await recentActivitiesQuery;
      
      // Mettre à jour l'état
      setStats({
        pendingContracts: contractsResult.count || 0,
        commissions: commissionsValue,
        scheduledAppointments: appointmentsResult.count || 0,
        clients: clientsCount
      });
      
      // Transformer les activités pour l'affichage
      if (recentActivities) {
        setActivities(recentActivities.map(activity => ({
          title: activity.title,
          date: new Date(activity.date).toLocaleDateString('fr-FR'),
          type: 'appointment'
        })));
      }

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
  }, [isFreelancer, isAccountManager, isAdminOrSuperAdmin, user?.id, dataSources]);
  
  // Configurer l'écouteur pour les mises à jour en temps réel
  useEffect(() => {
    // Créer un canal pour les mises à jour des rendez-vous
    const appointmentsChannel = supabase
      .channel('public:appointments')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' }, 
        () => {
          toast.info("Nouvelles données de rendez-vous disponibles");
          fetchDashboardData();
        }
      )
      .subscribe((status) => {
        console.log('Status du canal appointments:', status);
        if (status === 'SUBSCRIBED') {
          const newDataSources = [...dataSources];
          newDataSources[2].status = 'connected';
          setDataSources(newDataSources);
        } else if (status === 'CHANNEL_ERROR') {
          const newDataSources = [...dataSources];
          newDataSources[2].status = 'error';
          setDataSources(newDataSources);
        }
      });
      
    // Créer un canal pour les mises à jour des devis
    const quotesChannel = supabase
      .channel('public:quotes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quotes' }, 
        () => {
          toast.info("Nouvelles données de devis disponibles");
          fetchDashboardData();
        }
      )
      .subscribe((status) => {
        console.log('Status du canal quotes:', status);
        if (status === 'SUBSCRIBED') {
          const newDataSources = [...dataSources];
          newDataSources[0].status = 'connected';
          setDataSources(newDataSources);
        } else if (status === 'CHANNEL_ERROR') {
          const newDataSources = [...dataSources];
          newDataSources[0].status = 'error';
          setDataSources(newDataSources);
        }
      });
      
    // Créer un canal pour les mises à jour des commissions
    const commissionsChannel = supabase
      .channel('public:commissions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'commissions' }, 
        () => {
          toast.info("Nouvelles données de commissions disponibles");
          fetchDashboardData();
        }
      )
      .subscribe((status) => {
        console.log('Status du canal commissions:', status);
        if (status === 'SUBSCRIBED') {
          const newDataSources = [...dataSources];
          newDataSources[1].status = 'connected';
          setDataSources(newDataSources);
        } else if (status === 'CHANNEL_ERROR') {
          const newDataSources = [...dataSources];
          newDataSources[1].status = 'error';
          setDataSources(newDataSources);
        }
      });
      
    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(commissionsChannel);
    };
  }, [fetchDashboardData, dataSources]);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchDashboardData();
    
    // Configurer un intervalle pour actualiser les données
    const intervalId = setInterval(fetchDashboardData, 60000); // Rafraîchir toutes les minutes
    
    // Nettoyer l'intervalle à la suppression du composant
    return () => clearInterval(intervalId);
  }, [fetchDashboardData]);

  return {
    stats,
    activities,
    loading,
    refreshing,
    lastUpdated,
    isConnected,
    dataSources,
    fetchDashboardData
  };
}
