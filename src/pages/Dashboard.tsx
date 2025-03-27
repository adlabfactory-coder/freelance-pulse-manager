import React, { useState, useEffect, useCallback } from "react";
import { BarChart, Calendar, FileText, Users } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/utils/format";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const { user, role, isFreelancer, isAccountManager, isAdminOrSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    pendingContracts: 0,
    commissions: 0,
    scheduledAppointments: 0,
    clients: 0
  });
  const [activities, setActivities] = useState<Array<{title: string, date: string, type: string}>>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
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
        appointmentsQuery = appointmentsQuery.eq('freelancerid', user.id);
      } else if (isAccountManager && user?.id) {
        // Pour les chargés de compte, montrer tous les contrats et rendez-vous
        // Logique spécifique si nécessaire
      }
      
      // Exécuter les requêtes
      const [contractsResult, appointmentsResult] = await Promise.all([
        pendingContractsQuery,
        appointmentsQuery
      ]);
      
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
        }
        
        // Récupérer les clients assignés au freelancer
        const { count: contactsCount } = await supabase
          .from('contacts')
          .select('count', { count: 'exact' })
          .eq('assignedTo', user.id);
          
        clientsCount = contactsCount || 0;
      } else {
        // Pour les admins et chargés de compte, montrer toutes les commissions et clients
        const { data: commissionsData } = await supabase
          .from('commissions')
          .select('amount')
          .eq('status', 'pending');
          
        if (commissionsData) {
          commissionsValue = commissionsData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        }
        
        const { count: contactsCount } = await supabase
          .from('contacts')
          .select('count', { count: 'exact' });
          
        clientsCount = contactsCount || 0;
      }
      
      // Récupérer les activités récentes
      let recentActivitiesQuery = supabase
        .from('appointments')
        .select('title, date, status')
        .order('date', { ascending: false })
        .limit(5);
        
      if (isFreelancer && user?.id) {
        recentActivitiesQuery = recentActivitiesQuery.eq('freelancerid', user.id);
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
    } catch (error) {
      console.error("Erreur lors du chargement des données du tableau de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord."
      });
    } finally {
      setLoading(false);
    }
  }, [isFreelancer, isAccountManager, isAdminOrSuperAdmin, user?.id, toast]);
  
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
        () => fetchDashboardData()
      )
      .subscribe();
      
    // Créer un canal pour les mises à jour des devis
    const quotesChannel = supabase
      .channel('public:quotes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quotes' }, 
        () => fetchDashboardData()
      )
      .subscribe();
      
    // Créer un canal pour les mises à jour des commissions
    const commissionsChannel = supabase
      .channel('public:commissions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'commissions' }, 
        () => fetchDashboardData()
      )
      .subscribe();
      
    // Nettoyer les abonnements à la suppression du composant
    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(commissionsChannel);
    };
  }, [fetchDashboardData]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue {user?.name} sur le tableau de bord AdLab Hub
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Contrats"
          value={stats.pendingContracts.toString()}
          icon={<FileText className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="en attente"
        />
        <StatsCard
          title="Commissions"
          value={formatCurrency(stats.commissions)}
          icon={<BarChart className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="à ce jour"
        />
        <StatsCard
          title="Rendez-vous"
          value={stats.scheduledAppointments.toString()}
          icon={<Calendar className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="programmés"
        />
        <StatsCard
          title="Clients"
          value={stats.clients.toString()}
          icon={<Users className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="enregistrés"
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
