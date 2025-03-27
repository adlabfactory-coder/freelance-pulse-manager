
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardActivity } from "./types";
import { useAuth } from "@/hooks/use-auth";

export function useDashboardActivities() {
  const { user, isFreelancer } = useAuth();
  const [activities, setActivities] = useState<DashboardActivity[]>([]);

  const fetchActivities = async () => {
    try {
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
      
      // Transformer les activités pour l'affichage
      if (recentActivities) {
        setActivities(recentActivities.map(activity => ({
          title: activity.title,
          date: new Date(activity.date).toLocaleDateString('fr-FR'),
          type: 'appointment'
        })));
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error);
      setActivities([]);
    }
  };

  return { activities, setActivities, fetchActivities };
}
