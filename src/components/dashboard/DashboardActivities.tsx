
import React from "react";
import DashboardCard from "./DashboardCard";
import { DashboardActivity } from "@/hooks/useDashboardData";

interface DashboardActivitiesProps {
  activities: DashboardActivity[];
  loading: boolean;
}

const DashboardActivities: React.FC<DashboardActivitiesProps> = ({
  activities,
  loading
}) => {
  return (
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
  );
};

export default DashboardActivities;
