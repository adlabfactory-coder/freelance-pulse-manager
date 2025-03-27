
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wifi, WifiOff, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { DataSource } from "@/hooks/dashboard/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DashboardStatusIndicatorProps {
  isConnected: boolean;
  lastUpdated?: Date;
  isRefreshing: boolean;
  onManualRefresh: () => void;
  dataSources: DataSource[];
}

const DashboardStatusIndicator: React.FC<DashboardStatusIndicatorProps> = ({
  isConnected,
  lastUpdated,
  isRefreshing,
  onManualRefresh,
  dataSources,
}) => {
  const [timeAgo, setTimeAgo] = useState<string>("");
  
  // Mettre à jour le temps écoulé depuis la dernière mise à jour
  useEffect(() => {
    if (!lastUpdated) return;
    
    const updateTimeAgo = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdated.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      
      if (diffSecs < 60) {
        setTimeAgo(`il y a ${diffSecs} seconde${diffSecs > 1 ? 's' : ''}`);
      } else if (diffSecs < 3600) {
        const mins = Math.floor(diffSecs / 60);
        setTimeAgo(`il y a ${mins} minute${mins > 1 ? 's' : ''}`);
      } else {
        setTimeAgo(lastUpdated.toLocaleTimeString('fr-FR'));
      }
    };
    
    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000);
    
    return () => clearInterval(interval);
  }, [lastUpdated]);
  
  const connectivityStatus = isConnected 
    ? { label: "Connecté", icon: <Wifi className="h-4 w-4 text-green-500" />, color: "text-green-500" }
    : { label: "Déconnecté", icon: <WifiOff className="h-4 w-4 text-red-500" />, color: "text-red-500" };
  
  const dataSourcesStatus = dataSources.reduce((acc, source) => {
    acc[source.status] = (acc[source.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const healthyCount = dataSourcesStatus['connected'] || 0;
  const totalCount = dataSources.length;
  const healthPercentage = totalCount > 0 ? (healthyCount / totalCount) * 100 : 0;
  
  const handleRefreshClick = () => {
    if (!isRefreshing) {
      onManualRefresh();
    }
  };
  
  return (
    <div className="flex items-center space-x-3">
      {/* Ajout d'un bouton d'actualisation visible en dehors du popover */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleRefreshClick}
        disabled={isRefreshing}
        className="flex items-center gap-1"
      >
        {isRefreshing ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Actualiser</span>
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center space-x-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md px-2 py-1">
            {connectivityStatus.icon}
            <span className={`text-xs ${connectivityStatus.color}`}>
              {connectivityStatus.label}
            </span>
            {lastUpdated && (
              <span className="text-xs text-muted-foreground hidden md:inline">
                {timeAgo}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold">Statut du tableau de bord</h4>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                className="text-xs flex items-center space-x-1"
              >
                {isRefreshing ? (
                  <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1" />
                )}
                <span>Actualiser</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Santé globale</span>
                <span className="text-xs font-medium">{healthyCount}/{totalCount} sources connectées</span>
              </div>
              <Progress value={healthPercentage} className="h-2" />
            </div>
            
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">
                Dernière mise à jour: {lastUpdated.toLocaleDateString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit',
                  day: '2-digit',
                  month: 'short' 
                })}
              </p>
            )}
            
            <div className="space-y-2">
              <p className="text-xs font-medium">Sources de données:</p>
              <div className="space-y-1">
                {dataSources.map((source, index) => (
                  <div key={index} className="flex justify-between items-center text-xs p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span>{source.name}</span>
                    <div className="flex items-center space-x-1">
                      {source.status === 'connected' && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                      {source.status === 'disconnected' && (
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                      )}
                      {source.status === 'error' && (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span className={
                        source.status === 'connected' ? 'text-green-500' : 
                        source.status === 'error' ? 'text-red-500' : 'text-amber-500'
                      }>
                        {source.status === 'connected' ? 'Connecté' : 
                         source.status === 'error' ? 'Erreur' : 'Déconnecté'}
                      </span>
                      {source.lastSynced && (
                        <span className="text-[10px] text-muted-foreground ml-1">
                          {new Date(source.lastSynced).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DashboardStatusIndicator;
