
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";
import { Quote } from "@/types/quote";
import { generateQuotePDF } from "@/utils/pdfGenerator";

interface BulkActionsBarProps {
  selectedCount: number;
  onDelete: () => Promise<void>;
  selectedQuoteIds: string[];
  getQuoteById: (id: string | null) => Quote | null;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onDelete,
  selectedQuoteIds,
  getQuoteById
}) => {
  const handleDelete = async () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedCount} devis ?`)) {
      await onDelete();
    }
  };

  const handleDownload = async () => {
    // Télécharger tous les devis sélectionnés
    for (const quoteId of selectedQuoteIds) {
      const quote = getQuoteById(quoteId);
      if (quote) {
        await generateQuotePDF(quote);
      }
    }
  };

  return (
    <div className="bg-muted/30 border rounded-md p-3 flex items-center justify-between">
      <div className="text-sm font-medium">
        {selectedCount} devis sélectionnés
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="text-primary"
        >
          <Download className="mr-1 h-4 w-4" />
          Télécharger
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDelete}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
