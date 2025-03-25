
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Download, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommissionToolbar: React.FC = () => {
  const navigate = useNavigate();
  
  const handleExport = () => {
    // Logique d'exportation à implémenter plus tard
    console.log("Exporting commissions data...");
  };
  
  const handleSettings = () => {
    navigate("/settings/commissions");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="text" placeholder="Rechercher..." className="pl-8" />
      </div>
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" /> Filtrer
      </Button>
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" /> Exporter
      </Button>
      <Button variant="outline" size="sm" onClick={handleSettings} className="ml-auto">
        Paramètres
      </Button>
    </div>
  );
};

export default CommissionToolbar;
