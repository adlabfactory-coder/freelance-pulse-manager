
import { useState, useCallback } from "react";
import { createQuotesService } from "@/services/supabase/quotes";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Quote, QuoteItem, QuoteStatus } from "@/types/quote";
import { useQuoteValidation } from "../validation/useQuoteValidation";

const quotesService = createQuotesService(supabase);

interface UseQuoteUpdateProps {
  onSuccess?: (id?: string) => void;
  onCloseDialog?: (open: boolean) => void;
  onQuoteCreated?: (id?: string) => void;
}

/**
 * Hook pour la mise à jour des devis existants
 */
export const useQuoteUpdate = ({
  onSuccess,
  onCloseDialog,
  onQuoteCreated
}: UseQuoteUpdateProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateQuoteData } = useQuoteValidation();
  
  const handleSubmitEdit = useCallback(async (
    id: string, 
    quoteData: Partial<Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>>,
    items: (Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]
  ) => {
    console.log("handleSubmitEdit called for ID:", id);
    
    // Valider les données du devis
    const validation = validateQuoteData(
      quoteData.contactId || '',
      quoteData.freelancerId || '',
      quoteData.validUntil || new Date(),
      quoteData.items || []
    );
    
    if (!validation.isValid) {
      return { success: false };
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Mise à jour du devis", id);
      
      // Traiter les éléments à ajouter
      const itemsToAdd = items
        .filter(item => item.isNew && !item.toDelete && item.description && item.quantity && item.unitPrice)
        .map(({ isNew, toDelete, id, ...item }) => ({
          description: item.description!,
          quantity: item.quantity!,
          unitPrice: item.unitPrice!,
          tax: item.tax || 0,
          discount: item.discount || 0,
          serviceId: item.serviceId
        }));
      
      // Traiter les éléments à mettre à jour
      const itemsToUpdate = items
        .filter(item => item.id && !item.isNew && !item.toDelete)
        .map(({ isNew, toDelete, ...item }) => ({
          id: item.id!,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          tax: item.tax,
          discount: item.discount
        }));
      
      // Traiter les éléments à supprimer
      const itemsToDelete = items
        .filter(item => item.toDelete && item.id)
        .map(item => item.id as string);
      
      // Convertir explicitement le status en QuoteStatus s'il existe
      const processedQuoteData = {
        ...quoteData,
        folder: quoteData.folder || 'general',
        status: quoteData.status ? quoteData.status as QuoteStatus : undefined
      };
      
      // Mettre à jour le devis
      const updatedQuote = await quotesService.updateQuote(
        id,
        processedQuoteData,
        {
          add: itemsToAdd,
          update: itemsToUpdate,
          delete: itemsToDelete
        }
      );
      
      if (updatedQuote) {
        toast.success("Devis mis à jour avec succès");
        
        // Gérer les callbacks de succès
        if (onCloseDialog) onCloseDialog(false);
        if (onQuoteCreated) onQuoteCreated(updatedQuote.id);
        if (onSuccess) onSuccess(updatedQuote.id);
        
        return { success: true, quoteId: updatedQuote.id };
      }
      
      return { success: false };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du devis:", error);
      toast.error("Une erreur est survenue lors de la mise à jour du devis");
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  }, [onCloseDialog, onQuoteCreated, onSuccess, validateQuoteData]);
  
  return {
    isSubmitting,
    handleSubmitEdit
  };
};
