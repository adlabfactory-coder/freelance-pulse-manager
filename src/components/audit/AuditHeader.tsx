
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileCog } from "lucide-react";

interface AuditHeaderProps {
  exportToCSV: () => void;
}

const AuditHeader: React.FC<AuditHeaderProps> = ({ exportToCSV }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <FileCog className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Journal d'audit du système</h1>
          <p className="text-muted-foreground">
            Consultez toutes les activités et les modifications importantes dans le système
          </p>
        </div>
      </div>
      <Button onClick={exportToCSV} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Exporter
      </Button>
    </div>
  );
};

export default AuditHeader;
