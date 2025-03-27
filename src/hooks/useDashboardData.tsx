
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

export interface DashboardTask {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
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
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
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

        // Récupérer les tâches à faire pour le freelancer
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')  // Ou appointments, selon votre modèle de données
          .select('id, title, due_date, status, priority')
          .eq('assignedTo', user.id)
          .eq('status', 'pending')
          .order('due_date', { ascending: true })
          .limit(5);

        if (!tasksError && tasksData) {
          const formattedTasks = tasksData.map(task => ({
            id: task.id,
            title: task.title,
            dueDate: new Date(task.due_date).toLocaleDateString('fr-FR'),
            status: task.status,
            priority: task.priority || 'medium'
          }));
          setTasks(formattedTasks);
        } else {
          console.error("Erreur lors de la récupération des tâches:", tasksError);
          // Générer des données de démonstration si erreur
          setTasks([]);
        }
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

        // Récupérer les tâches en attente pour les administrateurs
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')  // Ou une autre table selon votre modèle
          .select('id, title, due_date, status, priority')
          .eq('status', 'pending')
          .order('due_date', { ascending: true })
          .limit(5);

        if (!tasksError && tasksData) {
          const formattedTasks = tasksData.map(task => ({
            id: task.id,
            title: task.title,
            dueDate: new Date(task.due_date).toLocaleDateString('fr-FR'),
            status: task.status,
            priority: task.priority || 'medium'
          }));
          setTasks(formattedTasks);
        } else {
          console.error("Erreur lors de la récupération des tâches:", tasksError);
          // Générer des données de démonstration si erreur
          setTasks([]);
        }
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
  
  // Configurer les écouteurs pour les mises à jour en temps réel
  useEffect(() => {
    // Créer des canaux pour les mises à jour en temps réel
    const appointmentsChannel = supabase.channel('realtime-appointments')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' }, 
        (payload) => {
          console.log("Changement détecté dans les rendez-vous:", payload);
          toast.info("Nouvelles données de rendez-vous disponibles");
          fetchDashboardData();
        }
      )
      .subscribe();
      
    const quotesChannel = supabase.channel('realtime-quotes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quotes' }, 
        (payload) => {
          console.log("Changement détecté dans les devis:", payload);
          toast.info("Nouvelles données de devis disponibles");
          fetchDashboardData();
        }
      )
      .subscribe();
      
    const commissionsChannel = supabase.channel('realtime-commissions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'commissions' }, 
        (payload) => {
          console.log("Changement détecté dans les commissions:", payload);
          toast.info("Nouvelles données de commissions disponibles");
          fetchDashboardData();
        }
      )
      .subscribe();

    const contactsChannel = supabase.channel('realtime-contacts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contacts' }, 
        (payload) => {
          console.log("Changement détecté dans les contacts:", payload);
          toast.info("Mise à jour des données clients");
          fetchDashboardData();
        }
      )
      .subscribe();

    const tasksChannel = supabase.channel('realtime-tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' }, 
        (payload) => {
          console.log("Changement détecté dans les tâches:", payload);
          toast.info("Mise à jour des tâches");
          fetchDashboardData();
        }
      )
      .subscribe();
      
    // Nettoyer les canaux à la suppression du composant
    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(commissionsChannel);
      supabase.removeChannel(contactsChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [fetchDashboardData]);

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
