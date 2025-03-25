
import React from "react";
import { Filter, FileDown, FileUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuotesToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

const QuotesToolbar: React.FC<QuotesToolbarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onAddClick 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative w-full md:w-64">
          <Input 
            type="text" 
            placeholder="Rechercher..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" /> Filtrer
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <FileDown className="mr-2 h-4 w-4" /> Exporter
        </Button>
        <Button variant="outline" size="sm">
          <FileUp className="mr-2 h-4 w-4" /> Importer
        </Button>
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" /> Créer un devis
        </Button>
      </div>
    </div>
  );
};

export default QuotesToolbar;
