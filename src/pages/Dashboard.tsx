
import React, { useState, useEffect, useCallback } from "react";
import { BarChart, Calendar, FileText, Users } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/utils/format";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import StatsCardWithTooltip from "@/components/dashboard/StatsCardWithTooltip";
import DashboardStatusIndicator from "@/components/dashboard/DashboardStatusIndicator";

const Dashboard: React.FC = () => {
  const { user, role, isFreelancer, isAccountManager, isAdminOrSuperAdmin } = useAuth();
  const [stats, setStats] = useState({
    pendingContracts: 0,
    commissions: 0,
    scheduledAppointments: 0,
    clients: 0
  });
  const [activities, setActivities] = useState<Array<{title: string, date: string, type: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(true);
  const [dataSources, setDataSources] = useState([
    { name: 'Contrats', status: 'connected' as const, lastSynced: new Date() },
    { name: 'Commissions', status: 'connected' as const, lastSynced: new Date() },
    { name: 'Rendez-vous', status: 'connected' as const, lastSynced: new Date() },
    { name: 'Clients', status: 'connected' as const, lastSynced: new Date() }
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
  
  // Charger les données au montage du composant
  useEffect(() => {
    fetchDashboardData();
    
    // Configurer un intervalle pour actualiser les données
    const intervalId = setInterval(fetchDashboardData, 60000); // Rafraîchir toutes les minutes
    
    // Nettoyer l'intervalle à la suppression du composant
    return () => clearInterval(intervalId);
  }, [fetchDashboardData]);
  
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
      
    // Nettoyer les abonnements à la suppression du composant
    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(commissionsChannel);
    };
  }, [fetchDashboardData, dataSources]);

  const handleStatsCardClick = (cardType: string) => {
    switch (cardType) {
      case 'contracts':
        toast.info("Redirection vers la page des contrats");
        // Ici vous pourriez implémenter une redirection vers la page des contrats
        break;
      case 'commissions':
        toast.info("Redirection vers la page des commissions");
        // Ici vous pourriez implémenter une redirection vers la page des commissions
        break;
      case 'appointments':
        toast.info("Redirection vers la page des rendez-vous");
        // Ici vous pourriez implémenter une redirection vers la page des rendez-vous
        break;
      case 'clients':
        toast.info("Redirection vers la page des clients");
        // Ici vous pourriez implémenter une redirection vers la page des clients
        break;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue {user?.name} sur le tableau de bord AdLab Hub
          </p>
        </div>
        
        <DashboardStatusIndicator 
          isConnected={isConnected}
          lastUpdated={lastUpdated}
          isRefreshing={refreshing}
          onManualRefresh={() => fetchDashboardData()}
          dataSources={dataSources}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCardWithTooltip
          title="Contrats"
          value={stats.pendingContracts.toString()}
          icon={<FileText className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="en attente"
          dataSource="Tableau Quotes - Supabase"
          lastUpdated={dataSources[0].lastSynced}
          onClick={() => handleStatsCardClick('contracts')}
        />
        <StatsCardWithTooltip
          title="Commissions"
          value={formatCurrency(stats.commissions)}
          icon={<BarChart className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="à ce jour"
          dataSource="Tableau Commissions - Supabase"
          lastUpdated={dataSources[1].lastSynced}
          onClick={() => handleStatsCardClick('commissions')}
        />
        <StatsCardWithTooltip
          title="Rendez-vous"
          value={stats.scheduledAppointments.toString()}
          icon={<Calendar className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="programmés"
          dataSource="Tableau Appointments - Supabase"
          lastUpdated={dataSources[2].lastSynced}
          onClick={() => handleStatsCardClick('appointments')}
        />
        <StatsCardWithTooltip
          title="Clients"
          value={stats.clients.toString()}
          icon={<Users className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="enregistrés"
          dataSource="Tableau Contacts - Supabase"
          lastUpdated={dataSources[3].lastSynced}
          onClick={() => handleStatsCardClick('clients')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Activités récentes">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.type}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              Aucune activité récente
            </div>
          )}
        </DashboardCard>

        <div className="grid grid-cols-1 gap-6">
          <DashboardCard title="Tâches à faire">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Aucune tâche en cours
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
