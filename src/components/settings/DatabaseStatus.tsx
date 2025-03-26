
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import DatabaseStatusBadge from "./database/DatabaseStatusBadge";
import DatabaseStatusTable from "./database/DatabaseStatusTable";
import ConnectionErrorAlert from "./database/ConnectionErrorAlert";
import LoadingIndicator from "./database/LoadingIndicator";
import { useDatabaseStatus } from "./database/useDatabaseStatus";

const DatabaseStatus: React.FC = () => {
  const { 
    tablesStatus, 
    isLoading, 
    refreshing, 
    connectionError, 
    status, 
    handleRefresh 
  } = useDatabaseStatus();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Statut de la base de données
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading || refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
        <CardDescription>
          État des tables et des données dans Supabase
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <ConnectionErrorAlert error={connectionError} />
        
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="mb-4 flex items-center">
              <span className="font-medium mr-3">Statut global:</span>
              <DatabaseStatusBadge status={status} />
            </div>
            
            <DatabaseStatusTable 
              tablesStatus={tablesStatus} 
              isLoading={isLoading} 
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseStatus;
