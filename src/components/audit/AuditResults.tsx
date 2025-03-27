
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuditTable from "./AuditTable";
import AuditDetailDialog from "./AuditDetailDialog";
import { AuditLog } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface AuditResultsProps {
  logs: AuditLog[];
  sortDirection: 'asc' | 'desc';
  toggleSortDirection: () => void;
  selectedLogs: string[];
  setSelectedLogs: React.Dispatch<React.SetStateAction<string[]>>;
  exportSelectedToCSV: () => void;
}

const AuditResults: React.FC<AuditResultsProps> = ({
  logs,
  sortDirection,
  toggleSortDirection,
  selectedLogs,
  setSelectedLogs,
  exportSelectedToCSV
}) => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelectAll = () => {
    if (selectedLogs.length === logs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(logs.map(log => log.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLogs(prev => 
      prev.includes(id) 
        ? prev.filter(logId => logId !== id) 
        : [...prev, id]
    );
  };

  const handleRowClick = (log: AuditLog) => {
    setSelectedLog(log);
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Résultats ({logs.length})</CardTitle>
            {selectedLogs.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportSelectedToCSV}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exporter {selectedLogs.length} élément(s)
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <AuditTable 
            logs={logs} 
            sortDirection={sortDirection} 
            toggleSortDirection={toggleSortDirection} 
            selectedLogs={selectedLogs}
            onSelectAll={handleSelectAll}
            onToggleSelect={handleToggleSelect}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>

      <AuditDetailDialog 
        log={selectedLog}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default AuditResults;
