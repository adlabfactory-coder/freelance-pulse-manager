
import React from "react";
import { DashboardActivity } from "@/hooks/useDashboardData";
import { Calendar, Clock, FileText, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardActivitiesProps {
  activities: DashboardActivity[];
  loading: boolean;
}

const DashboardActivities: React.FC<DashboardActivitiesProps> = ({
  activities,
  loading
}) => {
  // Sélectionner l'icône appropriée selon le type d'activité
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'quote':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'contact':
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground p-4">
        <div className="text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p>Aucune activité récente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
            <div className="mt-0.5 bg-muted rounded-full p-1.5">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-medium text-sm">{activity.title}</p>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{activity.date}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.type === 'appointment' && 'Rendez-vous'}
                {activity.type === 'quote' && 'Devis'}
                {activity.type === 'contact' && 'Contact'}
                {!['appointment', 'quote', 'contact'].includes(activity.type) && 'Activité'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardActivities;
