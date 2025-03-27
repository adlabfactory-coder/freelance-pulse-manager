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
  
  // Fonction sécurisée pour la validation des dates
  const validateDate = (date: string | Date): Date => {
    return typeof date === 'string' ? new Date(date) : date;
  };
  
  const handleSubmit = useCallback(async (
    quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>, 
    items: (Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]
  ) => {
    console.log("handleSubmit called with data:", quoteData);
    
    // Validation des données du devis avec conversion de date sécurisée
    const validationDate = validateDate(quoteData.validUntil);
    const validation = validateQuoteForm(
      quoteData.contactId,
      quoteData.freelancerId,
      validationDate,
      quoteData.items
    );
    
    if (!validation.isValid) {
      toast.error(validation.errorMessage);
      return { success: false };
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Création d'un nouveau devis");
      
      // Préparation des items avec types corrects
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
      
      // S'assurer que folder est inclus
      const quoteDataWithFolder = {
        ...quoteData,
        folder: quoteData.folder || 'general'
      };
      
      const newQuote = await quotesService.createQuote(
        quoteDataWithFolder,
        itemsToCreate
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

  // Gestion de la mise à jour d'un devis existant
  const handleSubmitEdit = useCallback(async (
    id: string, 
    quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>,
    items: (Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]
  ) => {
    console.log("handleSubmitEdit called for ID:", id);
    
    // Validation avec conversion de date sécurisée
    const validationDate = validateDate(quoteData.validUntil);
    const validation = validateQuoteForm(
      quoteData.contactId,
      quoteData.freelancerId,
      validationDate,
      quoteData.items
    );
    
    if (!validation.isValid) {
      toast.error(validation.errorMessage);
      return { success: false };
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Mise à jour du devis", id);
      
      // Préparation des items avec les bonnes typologies
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
        
      // Conversion explicite des types pour éviter les erreurs TypeScript  
      const itemsToUpdate = items
        .filter(item => item.id && !item.isNew && !item.toDelete)
        .map(({ isNew, toDelete, ...item }) => ({
          ...item,
          id: item.id // S'assurer que l'id est toujours présent
        }));
        
      const itemsToDelete = items
        .filter(item => item.toDelete && item.id)
        .map(item => item.id as string);
      
      // S'assurer que folder est inclus
      const quoteDataWithFolder = {
        ...quoteData,
        folder: quoteData.folder || 'general'
      };
      
      const updatedQuote = await quotesService.updateQuote(
        id,
        quoteDataWithFolder,
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
