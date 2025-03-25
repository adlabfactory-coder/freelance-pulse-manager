
import React from "react";
import { BarChart, Calendar, FileText, Users } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue sur le tableau de bord FreelancePulse
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Contrats signés"
          value="32"
          icon={<FileText className="h-6 w-6" />}
          change={12}
          trend="up"
          description="vs mois précédent"
        />
        <StatsCard
          title="Commissions"
          value="€4,562.00"
          icon={<BarChart className="h-6 w-6" />}
          change={-3}
          trend="down"
          description="vs mois précédent"
        />
        <StatsCard
          title="Rendez-vous à venir"
          value="12"
          icon={<Calendar className="h-6 w-6" />}
          change={0}
          trend="neutral"
          description="cette semaine"
        />
        <StatsCard
          title="Total clients"
          value="243"
          icon={<Users className="h-6 w-6" />}
          change={8}
          trend="up"
          description="vs mois précédent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Activités récentes">
          <div className="space-y-4 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {i % 2 === 0 ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <Calendar className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {i % 2 === 0
                      ? "Nouveau devis créé pour Entreprise"
                      : "Rendez-vous confirmé avec Client"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Il y a {i * 10} minutes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <div className="grid grid-cols-1 gap-6">
          <DashboardCard title="Tâches à faire">
            <div className="space-y-2 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center p-2 rounded-lg hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    className="mr-3 h-4 w-4 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <p className="font-medium">
                      {i % 2 === 0
                        ? "Envoyer rappel pour le devis en attente"
                        : "Préparer présentation pour le rendez-vous client"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {i % 2 === 0 ? "Priorité haute" : "Priorité normale"}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {i === 1 ? "Aujourd'hui" : `Dans ${i} jours`}
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Prochains rendez-vous">
            <div className="space-y-2 mt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center p-2 rounded-lg hover:bg-muted/50"
                >
                  <div className="mr-3 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">{i + 10}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Rendez-vous avec Client {i}</p>
                    <p className="text-sm text-muted-foreground">
                      15:00 - 16:00
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      Zoom
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
