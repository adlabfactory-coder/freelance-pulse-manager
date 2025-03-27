
import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown, FileUp, Plus } from "lucide-react";
import QuoteFilterBar, { QuoteFilters } from "./QuoteFilterBar";

interface QuoteViewerToolbarProps {
  filters: QuoteFilters;
  onFilterChange: (filters: QuoteFilters) => void;
  onSearchChange: (search: string) => void;
  onResetFilters: () => void;
  onAddClick: () => void;
  freelancerOptions: Array<{ id: string, name: string }>;
  contactOptions: Array<{ id: string, name: string }>;
  showAddButton?: boolean;
}

const QuoteViewerToolbar: React.FC<QuoteViewerToolbarProps> = ({
  filters,
  onFilterChange,
  onSearchChange,
  onResetFilters,
  onAddClick,
  freelancerOptions,
  contactOptions,
  showAddButton = true
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <QuoteFilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onResetFilters={onResetFilters}
          freelancerOptions={freelancerOptions}
          contactOptions={contactOptions}
        />
        
        <div className="flex flex-wrap gap-2 ml-auto mt-2 md:mt-0">
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button variant="outline" size="sm">
            <FileUp className="mr-2 h-4 w-4" /> Importer
          </Button>
          {showAddButton && (
            <Button onClick={onAddClick}>
              <Plus className="mr-2 h-4 w-4" /> Créer un devis
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteViewerToolbar;
