import React from "react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wifi, WifiOff, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { DataSource } from "@/hooks/dashboard";

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
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center space-x-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md px-2 py-1">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-xs text-muted-foreground">
              {isConnected ? "Connecté" : "Déconnecté"}
            </span>
            {isRefreshing && (
              <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold">Statut du tableau de bord</h4>
              <button 
                onClick={onManualRefresh}
                className="text-xs flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Actualiser</span>
              </button>
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
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span>{source.name}</span>
                    <div className="flex items-center space-x-1">
                      {source.status === 'connected' && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                      {source.status === 'disconnected' && (
                        <WifiOff className="h-3 w-3 text-amber-500" />
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
