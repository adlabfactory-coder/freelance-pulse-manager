
import React from "react";

interface DashboardTasksProps {
  loading: boolean;
}

const DashboardTasks: React.FC<DashboardTasksProps> = ({ loading }) => {
  return (
    <div className="p-4">
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          Aucune tâche en cours
        </div>
      )}
    </div>
  );
};

export default DashboardTasks;
