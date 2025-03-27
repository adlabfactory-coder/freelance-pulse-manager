
import { useState, useEffect } from "react";
import { Quote } from "@/types/quote";
import { toast } from "sonner";
import { createQuotesDeleteService } from "@/services/supabase/quotes/quotes-delete";
import { supabase } from "@/lib/supabase-client";

export const useQuotesSelection = (
  filteredQuotes: Quote[],
  refreshQuotes: () => Promise<void>
) => {
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const quotesDeleteService = createQuotesDeleteService(supabase);

  // Réinitialiser la sélection quand les devis filtrés changent
  useEffect(() => {
    setSelectedQuoteIds([]);
    setSelectAll(false);
  }, [filteredQuotes.length]);

  // Gestion de la sélection
  const toggleSelectQuote = (quoteId: string) => {
    setSelectedQuoteIds(prev => {
      if (prev.includes(quoteId)) {
        return prev.filter(id => id !== quoteId);
      } else {
        return [...prev, quoteId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuoteIds([]);
    } else {
      setSelectedQuoteIds(filteredQuotes.map(quote => quote.id));
    }
    setSelectAll(!selectAll);
  };

  // Supprimer les devis sélectionnés
  const deleteSelectedQuotes = async () => {
    if (selectedQuoteIds.length === 0) return;
    
    try {
      let hasError = false;
      
      // Utiliser Promise.all pour supprimer tous les devis en parallèle
      await Promise.all(
        selectedQuoteIds.map(async (id) => {
          const success = await quotesDeleteService.deleteQuote(id);
          if (!success) {
            hasError = true;
          }
        })
      );
      
      if (hasError) {
        toast.error("Des erreurs sont survenues lors de la suppression de certains devis");
      } else {
        toast.success(`${selectedQuoteIds.length} devis supprimés avec succès`);
      }
      
      // Recharger les devis après la suppression
      await refreshQuotes();
      
    } catch (error) {
      console.error("Erreur lors de la suppression des devis:", error);
      toast.error("Erreur lors de la suppression des devis");
    }
  };

  return {
    selectedQuoteIds,
    selectAll,
    toggleSelectQuote,
    handleSelectAll,
    deleteSelectedQuotes
  };
};
