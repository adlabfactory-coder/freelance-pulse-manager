
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Quote, QuoteItem, QuoteStatus } from "@/types";
import { createQuote, updateQuote } from "@/services/quote-service";

export interface UseQuoteSubmissionProps {
  onSuccess?: (quoteId: string) => void;
  onError?: (error: any) => void;
}

export const useQuoteSubmission = ({ 
  onSuccess, 
  onError 
}: UseQuoteSubmissionProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSaved, setIsQuoteSaved] = useState(false); 
  const { user } = useAuth();
  
  const submitQuote = useCallback(async (
    quoteData: Partial<Quote>,
    items: QuoteItem[]
  ) => {
    setIsSubmitting(true);
    
    try {
      // Valider les données requises
      if (!quoteData.contactId) {
        throw new Error("Veuillez sélectionner un contact");
      }
      
      if (!quoteData.freelancerId) {
        throw new Error("Un freelancer doit être assigné à ce devis");
      }
      
      if (!quoteData.validUntil) {
        throw new Error("Veuillez spécifier une date de validité");
      }
      
      if (!quoteData.totalAmount && quoteData.totalAmount !== 0) {
        throw new Error("Le montant total est requis");
      }
      
      if (!items || items.length === 0) {
        throw new Error("Veuillez ajouter au moins un service au devis");
      }
      
      // Formater les données pour la soumission
      const formattedItems = items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        tax: item.tax || 0,
        serviceId: item.serviceId
      }));
      
      // Prepare quote data object
      const quoteDataObj = {
        contactId: quoteData.contactId,
        freelancerId: quoteData.freelancerId,
        totalAmount: quoteData.totalAmount,
        status: quoteData.status || QuoteStatus.DRAFT,
        validUntil: quoteData.validUntil,
        notes: quoteData.notes || "",
        folder: quoteData.folder || "general"
      };
      
      // Fix: Pass the quote data and items as separate arguments to createQuote
      const result = await createQuote(quoteDataObj, formattedItems);
      
      if (result && result.id) {
        toast.success("Devis créé avec succès");
        setIsQuoteSaved(true);
        if (onSuccess) {
          onSuccess(result.id);
        }
        return result.id;
      } else {
        throw new Error("Erreur lors de la création du devis: réponse invalide");
      }
    } catch (error: any) {
      console.error("Erreur lors de la soumission du devis:", error);
      toast.error(error.message || "Erreur lors de la création du devis");
      
      if (onError) {
        onError(error);
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [onSuccess, onError, user]);
  
  // Fonction pour créer un nouveau devis
  const handleSubmit = useCallback(async (quoteData: Partial<Quote>, items: QuoteItem[]) => {
    return await submitQuote(quoteData, items);
  }, [submitQuote]);
  
  // Fonction pour éditer un devis existant
  const handleSubmitEdit = useCallback(async (quoteId: string, quoteData: Partial<Quote>, items: QuoteItem[]) => {
    setIsSubmitting(true);
    
    try {
      // Validation des données requises - similaire à submitQuote
      if (!quoteData.contactId) {
        throw new Error("Veuillez sélectionner un contact");
      }
      
      if (!quoteData.freelancerId) {
        throw new Error("Un freelancer doit être assigné à ce devis");
      }
      
      if (!quoteData.validUntil) {
        throw new Error("Veuillez spécifier une date de validité");
      }
      
      if (!quoteData.totalAmount && quoteData.totalAmount !== 0) {
        throw new Error("Le montant total est requis");
      }
      
      if (!items || items.length === 0) {
        throw new Error("Veuillez ajouter au moins un service au devis");
      }
      
      // Prepare quote data object
      const quoteDataObj = {
        contactId: quoteData.contactId,
        freelancerId: quoteData.freelancerId,
        totalAmount: quoteData.totalAmount,
        status: quoteData.status || QuoteStatus.DRAFT,
        validUntil: quoteData.validUntil,
        notes: quoteData.notes || "",
        folder: quoteData.folder || "general"
      };
      
      // Separate items into add, update, and delete collections
      const itemsToAdd = items
        .filter(item => !item.id) // New items that don't have an ID yet
        .map(({ id, quoteId, ...item }) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          tax: item.tax || 0,
          serviceId: item.serviceId
        }));
        
      const itemsToUpdate = items
        .filter(item => !!item.id) // Existing items that have an ID
        .map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          tax: item.tax || 0
        }));
      
      // For this example, we're not handling item deletion
      // In a real app, you'd track items to delete in your state
      const itemsToDelete: string[] = [];
      
      // Fix: Pass quoteId, quoteData and properly formatted items object to updateQuote
      const result = await updateQuote(quoteId, quoteDataObj, {
        add: itemsToAdd,
        update: itemsToUpdate,
        delete: itemsToDelete
      });
      
      if (result && result.id) {
        toast.success("Devis mis à jour avec succès");
        setIsQuoteSaved(true);
        if (onSuccess) {
          onSuccess(result.id);
        }
        return result.id;
      } else {
        throw new Error("Erreur lors de la mise à jour du devis: réponse invalide");
      }
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du devis:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du devis");
      
      if (onError) {
        onError(error);
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [onSuccess, onError]);
  
  return {
    isSubmitting,
    isQuoteSaved,
    submitQuote,
    handleSubmit,
    handleSubmitEdit
  };
};
