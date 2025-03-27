
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AuditHeaderProps {
  exportToCSV: () => void;
  selectedCount?: number;
}

const AuditHeader: React.FC<AuditHeaderProps> = ({ 
  exportToCSV,
  selectedCount = 0
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Journaux d'audit</h1>
      <Button variant="outline" onClick={exportToCSV}>
        <Download className="mr-2 h-4 w-4" />
        Exporter tout
      </Button>
    </div>
  );
};

export default AuditHeader;
