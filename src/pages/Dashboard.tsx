
import React, { useState, useEffect } from "react";
import { BarChart, Calendar, FileText, Users } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Limite à un seul chargement
  useEffect(() => {
    if (!dataLoaded) {
      console.log("Chargement initial du tableau de bord");
      // Ici, vous pouvez ajouter d'autres chargements de données si nécessaire
      setDataLoaded(true);
    }
  }, [dataLoaded]);
  
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
          value="0"
          icon={<FileText className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="en attente"
        />
        <StatsCard
          title="Commissions"
          value="€0.00"
          icon={<BarChart className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="à ce jour"
        />
        <StatsCard
          title="Rendez-vous"
          value="0"
          icon={<Calendar className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="programmés"
        />
        <StatsCard
          title="Clients"
          value="0"
          icon={<Users className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="enregistrés"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Activités récentes">
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Aucune activité récente
          </div>
        </DashboardCard>

        <div className="grid grid-cols-1 gap-6">
          <DashboardCard title="Tâches à faire">
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              Aucune tâche en cours
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
