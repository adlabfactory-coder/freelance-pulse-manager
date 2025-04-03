
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase"; // Import standardisé
import { DashboardTask } from "./types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function useDashboardTasks() {
  const { user, isFreelancer } = useAuth();
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      console.log("Aucun utilisateur connecté, impossible de récupérer les tâches");
      setTasks([]);
      return [];
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Vérifier d'abord si la table existe pour éviter les erreurs en boucle
      const { data: existsData, error: existsError } = await supabase.rpc('check_table_exists', { table_name: 'tasks' });
      
      if (existsError || !existsData) {
        console.log("La table 'tasks' n'existe pas encore dans la base de données");
        setTasks([]);
        setIsLoading(false);
        return [];
      }
      
      // Si la table existe, récupérer les tâches selon le rôle de l'utilisateur
      let tasksQuery = supabase
        .from('tasks')
        .select('id, title, due_date, status, priority')
        .eq('status', 'pending')
        .order('due_date', { ascending: true })
        .limit(5);

      if (isFreelancer && user?.id) {
        // Utilisation du nouveau nom de colonne standardisé
        tasksQuery = tasksQuery.eq('assigned_to', user.id);
      }

      const { data: tasksData, error: tasksError } = await tasksQuery;

      if (tasksError) {
        console.error("Erreur lors de la récupération des tâches:", tasksError);
        setError(tasksError.message);
        setTasks([]);
        setIsLoading(false);
        return [];
      }
      
      if (tasksData) {
        const formattedTasks = tasksData.map(task => ({
          id: task.id,
          title: task.title,
          dueDate: new Date(task.due_date).toLocaleDateString('fr-FR'),
          status: task.status,
          priority: task.priority || 'medium'
        }));
        setTasks(formattedTasks);
        setIsLoading(false);
        return formattedTasks;
      } else {
        setTasks([]);
        setIsLoading(false);
        return [];
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des tâches:", error);
      setError(error.message);
      setTasks([]);
      setIsLoading(false);
      return [];
    }
  }, [user, isFreelancer]);

  return { tasks, setTasks, fetchTasks, isLoading, error };
}
