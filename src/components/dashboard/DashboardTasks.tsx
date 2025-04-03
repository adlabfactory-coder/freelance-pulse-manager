
import React from "react";
import { CheckCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardTask } from "@/hooks/dashboard";

interface DashboardTasksProps {
  loading: boolean;
  tasks?: DashboardTask[];
}

const DashboardTasks: React.FC<DashboardTasksProps> = ({ 
  loading,
  tasks = []
}) => {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground p-4">
        <CheckCircle className="h-8 w-8 mb-2 text-green-500" />
        <p>Aucune tâche en cours</p>
        <p className="text-xs text-center mt-1">Toutes vos tâches sont complétées</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center p-3 bg-background rounded-md border">
            <div className="flex items-start flex-col">
              <span className="font-medium">{task.title}</span>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Échéance: {task.dueDate}</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                task.priority === 'high' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                  : task.priority === 'medium'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {task.priority}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardTasks;
