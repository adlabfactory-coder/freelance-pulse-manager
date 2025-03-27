
import { useState, useCallback } from "react";
import { createQuotesService } from "@/services/supabase/quotes";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { QuoteItem, QuoteStatus } from "@/types/quote";
import { Quote } from "@/types/quote";
import { validateQuoteForm } from "./utils/quoteCalculations";

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
  
  const validateDate = (date: string | Date): Date => {
    return typeof date === 'string' ? new Date(date) : date;
  };
  
  const handleSubmit = useCallback(async (
    quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>, 
    items: (Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]
  ) => {
    console.log("handleSubmit called with data:", quoteData);
    
    const validationDate = validateDate(quoteData.validUntil);
    const validation = validateQuoteForm(
      quoteData.contactId,
      quoteData.freelancerId,
      validationDate,
      quoteData.items || []
    );
    
    if (!validation.isValid) {
      toast.error(validation.errorMessage);
      return { success: false };
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Création d'un nouveau devis");
      
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
      
      const quoteDataWithFolder = {
        contactId: quoteData.contactId,
        freelancerId: quoteData.freelancerId,
        totalAmount: quoteData.totalAmount,
        validUntil: quoteData.validUntil,
        status: quoteData.status,
        notes: quoteData.notes || null,
        folder: quoteData.folder || 'general',
      };
      
      const newQuote = await quotesService.createQuote(
        quoteDataWithFolder as Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>,
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
  
  const handleSubmitEdit = useCallback(async (
    id: string, 
    quoteData: Partial<Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>>,
    items: (Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]
  ) => {
    console.log("handleSubmitEdit called for ID:", id);
    
    const validationDate = validateDate(quoteData.validUntil || new Date());
    const validation = validateQuoteForm(
      quoteData.contactId || '',
      quoteData.freelancerId || '',
      validationDate,
      quoteData.items || []
    );
    
    if (!validation.isValid) {
      toast.error(validation.errorMessage);
      return { success: false };
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Mise à jour du devis", id);
      
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
      
      const itemsToDelete = items
        .filter(item => item.toDelete && item.id)
        .map(item => item.id as string);
      
      // Assurez-vous que status est de type QuoteStatus
      const processedQuoteData = {
        ...quoteData,
        folder: quoteData.folder || 'general',
        // Convertir explicitement status en QuoteStatus s'il existe
        status: quoteData.status ? quoteData.status as QuoteStatus : undefined
      };
      
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
