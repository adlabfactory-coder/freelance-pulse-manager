
import React from "react";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStatsSection from "@/components/dashboard/DashboardStats";
import DashboardActivities from "@/components/dashboard/DashboardActivities";
import DashboardTasks from "@/components/dashboard/DashboardTasks";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard: React.FC = () => {
  const {
    stats,
    activities,
    loading,
    refreshing,
    lastUpdated,
    isConnected,
    dataSources,
    fetchDashboardData
  } = useDashboardData();

  const handleStatsCardClick = (cardType: string) => {
    switch (cardType) {
      case 'contracts':
        toast.info("Redirection vers la page des contrats");
        break;
      case 'commissions':
        toast.info("Redirection vers la page des commissions");
        break;
      case 'appointments':
        toast.info("Redirection vers la page des rendez-vous");
        break;
      case 'clients':
        toast.info("Redirection vers la page des clients");
        break;
    }
  };
  
  return (
    <div className="space-y-6">
      <DashboardHeader
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        isRefreshing={refreshing}
        onManualRefresh={fetchDashboardData}
        dataSources={dataSources}
      />

      <DashboardStatsSection
        stats={stats}
        dataSources={dataSources}
        onCardClick={handleStatsCardClick}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardActivities 
          activities={activities} 
          loading={loading} 
        />

        <div className="grid grid-cols-1 gap-6">
          <DashboardTasks loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
