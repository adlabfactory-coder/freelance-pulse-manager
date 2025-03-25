
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuotesHeaderProps {
  onAddClick: () => void;
}

const QuotesHeader: React.FC<QuotesHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Devis</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos devis et propositions
        </p>
      </div>
      <Button onClick={onAddClick}>
        <Plus className="mr-2 h-4 w-4" /> Créer un devis
      </Button>
    </div>
  );
};

export default QuotesHeader;
