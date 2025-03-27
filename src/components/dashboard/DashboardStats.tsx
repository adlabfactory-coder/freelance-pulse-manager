import React from "react";
import { BarChart, Calendar, FileText, Users } from "lucide-react";
import StatsCardWithTooltip from "./StatsCardWithTooltip";
import { formatCurrency } from "@/utils/format";
import { DataSource, DashboardStats } from "@/hooks/dashboard";

interface DashboardStatsProps {
  stats: DashboardStats;
  dataSources: DataSource[];
  onCardClick: (cardType: string) => void;
}

const DashboardStatsSection: React.FC<DashboardStatsProps> = ({
  stats,
  dataSources,
  onCardClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCardWithTooltip
        title="Contrats"
        value={stats.pendingContracts.toString()}
        icon={<FileText className="h-6 w-6" />}
        change={0}
        trend="neutral"
        description="en attente"
        dataSource="Tableau Quotes - Supabase"
        lastUpdated={dataSources[0].lastSynced}
        onClick={() => onCardClick('contracts')}
      />
      <StatsCardWithTooltip
        title="Commissions"
        value={formatCurrency(stats.commissions)}
        icon={<BarChart className="h-6 w-6" />}
        change={0}
        trend="neutral"
        description="à ce jour"
        dataSource="Tableau Commissions - Supabase"
        lastUpdated={dataSources[1].lastSynced}
        onClick={() => onCardClick('commissions')}
      />
      <StatsCardWithTooltip
        title="Rendez-vous"
        value={stats.scheduledAppointments.toString()}
        icon={<Calendar className="h-6 w-6" />}
        change={0}
        trend="neutral"
        description="programmés"
        dataSource="Tableau Appointments - Supabase"
        lastUpdated={dataSources[2].lastSynced}
        onClick={() => onCardClick('appointments')}
      />
      <StatsCardWithTooltip
        title="Clients"
        value={stats.clients.toString()}
        icon={<Users className="h-6 w-6" />}
        change={0}
        trend="neutral"
        description="enregistrés"
        dataSource="Tableau Contacts - Supabase"
        lastUpdated={dataSources[3].lastSynced}
        onClick={() => onCardClick('clients')}
      />
    </div>
  );
};

export default DashboardStatsSection;
