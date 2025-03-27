
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuditTable from "./AuditTable";
import { AuditLog } from "@/types/audit";

interface AuditResultsProps {
  logs: AuditLog[];
  sortDirection: 'asc' | 'desc';
  toggleSortDirection: () => void;
}

const AuditResults: React.FC<AuditResultsProps> = ({
  logs,
  sortDirection,
  toggleSortDirection
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Résultats ({logs.length})</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <AuditTable 
          logs={logs} 
          sortDirection={sortDirection} 
          toggleSortDirection={toggleSortDirection} 
        />
      </CardContent>
    </Card>
  );
};

export default AuditResults;
