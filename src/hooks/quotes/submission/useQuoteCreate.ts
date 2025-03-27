
import { useState, useCallback } from "react";
import { createQuotesService } from "@/services/supabase/quotes";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Quote, QuoteItem } from "@/types/quote";
import { useQuoteValidation } from "../validation/useQuoteValidation";

const quotesService = createQuotesService(supabase);

interface UseQuoteCreateProps {
  onSuccess?: (id?: string) => void;
  onCloseDialog?: (open: boolean) => void;
  onQuoteCreated?: (id?: string) => void;
}

/**
 * Hook pour la création de nouveaux devis
 */
export const useQuoteCreate = ({
  onSuccess,
  onCloseDialog,
  onQuoteCreated
}: UseQuoteCreateProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateQuoteData } = useQuoteValidation();
  
  const handleSubmit = useCallback(async (
    quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>, 
    items: (Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]
  ) => {
    console.log("handleSubmit called with data:", quoteData);
    
    // Valider les données du devis
    const validation = validateQuoteData(
      quoteData.contactId,
      quoteData.freelancerId,
      quoteData.validUntil,
      quoteData.items || []
    );
    
    if (!validation.isValid) {
      return { success: false };
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Création d'un nouveau devis");
      
      // Filtrer et formater les éléments du devis
      const itemsToCreate = items
        .filter(item => !item.toDelete && item.description && item.quantity && item.unitPrice)
        .map(({ isNew, toDelete, id, ...item }) => ({
          description: item.description!,
          quantity: item.quantity!,
          unitPrice: item.unitPrice!,
          tax: item.tax || 0,
          discount: item.discount || 0,
          serviceId: item.serviceId
        }));
      
      // Préparer les données du devis avec le dossier par défaut
      const quoteDataWithFolder = {
        contactId: quoteData.contactId,
        freelancerId: quoteData.freelancerId,
        totalAmount: quoteData.totalAmount,
        validUntil: quoteData.validUntil,
        status: quoteData.status,
        notes: quoteData.notes || null,
        folder: quoteData.folder || 'general',
      };
      
      // Créer le devis
      const newQuote = await quotesService.createQuote(
        quoteDataWithFolder as Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>,
        itemsToCreate
      );
      
      if (newQuote) {
        console.log("Devis créé avec succès:", newQuote);
        toast.success("Devis créé avec succès");
        
        // Gérer les callbacks de succès
        if (onCloseDialog) {
          console.log("Fermeture du dialogue");
          onCloseDialog(false);
        }
        
        if (onQuoteCreated) {
          console.log("Appel de onQuoteCreated");
          onQuoteCreated(newQuote.id);
        }
        
        if (onSuccess) {
          console.log("Appel de onSuccess");
          onSuccess(newQuote.id);
        }
        
        return { success: true, quoteId: newQuote.id };
      }
      
      return { success: false };
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du devis:", error);
      toast.error("Une erreur est survenue lors de la sauvegarde du devis");
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  }, [onCloseDialog, onQuoteCreated, onSuccess, validateQuoteData]);
  
  return {
    isSubmitting,
    handleSubmit
  };
};
