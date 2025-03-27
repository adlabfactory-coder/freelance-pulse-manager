
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AuditHeaderProps {
  exportToCSV: () => void;
}

const AuditHeader: React.FC<AuditHeaderProps> = ({ exportToCSV }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Journaux d'audit</h1>
      <Button variant="outline" onClick={exportToCSV}>
        <Download className="mr-2 h-4 w-4" />
        Exporter
      </Button>
    </div>
  );
};

export default AuditHeader;
