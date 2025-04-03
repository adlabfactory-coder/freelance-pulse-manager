
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardTask } from "./types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function useDashboardTasks() {
  const { user, isFreelancer, isAdminOrSuperAdmin } = useAuth();
  const [tasks, setTasks] = useState<DashboardTask[]>([]);

  const fetchTasks = async () => {
    try {
      // Vérifier d'abord si la table existe pour éviter les erreurs en boucle
      const { data: existsData, error: existsError } = await supabase.rpc('check_table_exists', { table_name: 'tasks' });
      
      if (existsError || !existsData) {
        console.log("La table 'tasks' n'existe pas encore dans la base de données");
        setTasks([]);
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
        // Important: utiliser 'assignedto' en minuscules pour correspondre à la colonne dans la base de données
        tasksQuery = tasksQuery.eq('assignedto', user.id);
      }

      const { data: tasksData, error: tasksError } = await tasksQuery;

      if (!tasksError && tasksData) {
        const formattedTasks = tasksData.map(task => ({
          id: task.id,
          title: task.title,
          dueDate: new Date(task.due_date).toLocaleDateString('fr-FR'),
          status: task.status,
          priority: task.priority || 'medium'
        }));
        setTasks(formattedTasks);
        return formattedTasks;
      } else {
        console.error("Erreur lors de la récupération des tâches:", tasksError);
        setTasks([]);
        return [];
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
      setTasks([]);
      return [];
    }
  };

  return { tasks, setTasks, fetchTasks };
}
