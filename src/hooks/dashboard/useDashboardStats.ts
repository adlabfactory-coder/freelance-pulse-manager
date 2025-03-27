
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardStats, DataSource } from "./types";
import { useAuth } from "@/hooks/use-auth";

export function useDashboardStats() {
  const { user, isFreelancer, isAccountManager } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    pendingContracts: 0,
    commissions: 0,
    scheduledAppointments: 0,
    clients: 0
  });
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { name: 'Contrats', status: 'connected', lastSynced: new Date() },
    { name: 'Commissions', status: 'connected', lastSynced: new Date() },
    { name: 'Rendez-vous', status: 'connected', lastSynced: new Date() },
    { name: 'Clients', status: 'connected', lastSynced: new Date() }
  ]);

  const fetchStats = async () => {
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
        // Pour les chargés de compte, logique spécifique si nécessaire
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
      
      // Mettre à jour l'état des statistiques
      setStats({
        pendingContracts: contractsResult.count || 0,
        commissions: commissionsValue,
        scheduledAppointments: appointmentsResult.count || 0,
        clients: clientsCount
      });
      
      return newDataSources;
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      return dataSources;
    }
  };

  return { stats, dataSources, setDataSources, fetchStats };
}
