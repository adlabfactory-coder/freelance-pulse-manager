
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardTask } from "./types";
import { useAuth } from "@/hooks/use-auth";

export function useDashboardTasks() {
  const { user, isFreelancer, isAdminOrSuperAdmin } = useAuth();
  const [tasks, setTasks] = useState<DashboardTask[]>([]);

  const fetchTasks = async () => {
    try {
      // Récupérer les tâches selon le rôle de l'utilisateur
      let tasksQuery = supabase
        .from('tasks')
        .select('id, title, due_date, status, priority')
        .eq('status', 'pending')
        .order('due_date', { ascending: true })
        .limit(5);

      if (isFreelancer && user?.id) {
        tasksQuery = tasksQuery.eq('assignedTo', user.id);
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
      } else {
        console.error("Erreur lors de la récupération des tâches:", tasksError);
        setTasks([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
      setTasks([]);
    }
  };

  return { tasks, setTasks, fetchTasks };
}
