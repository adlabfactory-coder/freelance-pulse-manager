
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Download } from "lucide-react";

const CommissionToolbar: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center">
      <div className="relative w-full md:w-64">
        <Input type="text" placeholder="Rechercher..." />
      </div>
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" /> Filtrer
      </Button>
      <Button variant="outline" size="sm" className="ml-auto">
        <Download className="mr-2 h-4 w-4" /> Exporter
      </Button>
    </div>
  );
};

export default CommissionToolbar;
