
import { useState, useCallback } from "react";
import { createQuotesService } from "@/services/supabase/quotes";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Quote, QuoteItem } from "@/types";
import { validateQuoteForm } from "./utils/quoteCalculations";

// Create a quotes service instance
const quotesService = createQuotesService(supabase);

interface UseQuoteSubmissionProps {
  onSuccess?: (id?: string) => void;
  onCloseDialog?: (open: boolean) => void;
  onQuoteCreated?: (id?: string) => void;
}

export const useQuoteSubmission = ({ 
  onSuccess, 
  onCloseDialog, 
  onQuoteCreated 
}: UseQuoteSubmissionProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSaved, setIsQuoteSaved] = useState(false);
  
  const handleSubmit = useCallback(async (quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>, items: (Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]) => {
    console.log("handleSubmit called");
    
    const validation = validateQuoteForm(
      quoteData.contactId,
      quoteData.freelancerId,
      quoteData.validUntil,
      items
    );
    
    if (!validation.isValid) {
      toast.error(validation.errorMessage);
      return { success: false };
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Création d'un nouveau devis");
      
      const validItems = items
        .filter(item => !item.toDelete)
        .map(({ isNew, toDelete, id, ...item }) => item as Omit<QuoteItem, 'id' | 'quoteId'>);
      
      console.log("Données du devis:", quoteData);
      console.log("Éléments du devis:", validItems);
      
      const newQuote = await quotesService.createQuote(
        quoteData,
        validItems
      );
      
      if (newQuote) {
        console.log("Devis créé avec succès:", newQuote);
        toast.success("Devis créé avec succès");
        setIsQuoteSaved(true);
        
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
  }, [onCloseDialog, onQuoteCreated, onSuccess]);

  // Handle editing an existing quote
  const handleSubmitEdit = useCallback(async (
    id: string, 
    quoteData: Partial<Quote>, 
    items: (Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]
  ) => {
    const validation = validateQuoteForm(
      quoteData.contactId || '',
      quoteData.freelancerId || '',
      quoteData.validUntil || null,
      items.filter(item => !item.toDelete)
    );
    
    if (!validation.isValid) {
      toast.error(validation.errorMessage);
      return { success: false };
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Mise à jour du devis", id);
      
      const itemsToAdd = items
        .filter(item => item.isNew && !item.toDelete)
        .map(({ isNew, toDelete, id, ...item }) => item as Omit<QuoteItem, 'id' | 'quoteId'>);
        
      const itemsToUpdate = items
        .filter(item => item.id && !item.isNew && !item.toDelete)
        .map(({ isNew, toDelete, ...item }) => item as Pick<QuoteItem, 'id'> & Partial<Omit<QuoteItem, 'id' | 'quoteId'>>);
        
      const itemsToDelete = items
        .filter(item => item.toDelete && item.id)
        .map(item => item.id as string);
      
      const updatedQuote = await quotesService.updateQuote(
        id,
        {
          contactId: quoteData.contactId,
          freelancerId: quoteData.freelancerId,
          validUntil: quoteData.validUntil,
          status: quoteData.status,
          notes: quoteData.notes,
          totalAmount: quoteData.totalAmount
        },
        {
          add: itemsToAdd,
          update: itemsToUpdate,
          delete: itemsToDelete
        }
      );
      
      if (updatedQuote) {
        toast.success("Devis mis à jour avec succès");
        setIsQuoteSaved(true);
        
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
  }, [onCloseDialog, onQuoteCreated, onSuccess]);
  
  return {
    isSubmitting,
    isQuoteSaved,
    handleSubmit,
    handleSubmitEdit
  };
};
