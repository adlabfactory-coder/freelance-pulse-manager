import React from "react";
import { useAuth } from "@/hooks/use-auth";
import DashboardStatusIndicator from "./DashboardStatusIndicator";
import { DataSource } from "@/hooks/dashboard";

interface DashboardHeaderProps {
  isConnected: boolean;
  lastUpdated?: Date;
  isRefreshing: boolean;
  onManualRefresh: () => void;
  dataSources: DataSource[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isConnected,
  lastUpdated,
  isRefreshing,
  onManualRefresh,
  dataSources
}) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-row justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue {user?.name} sur le tableau de bord AdLab Hub
        </p>
      </div>
      
      <DashboardStatusIndicator 
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onManualRefresh={onManualRefresh}
        dataSources={dataSources}
      />
    </div>
  );
};

export default DashboardHeader;
