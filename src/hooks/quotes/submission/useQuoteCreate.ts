
import { useState, useCallback } from "react";
import { createQuotesService } from "@/services/supabase/quotes";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Quote, QuoteItem, QuoteStatus } from "@/types/quote";
import { useQuoteValidation } from "../validation/useQuoteValidation";

const quotesService = createQuotesService(supabase);

interface UseQuoteCreateProps {
  onSuccess?: (id?: string) => void;
  onError?: (error: any) => void;
  onCloseDialog?: (open: boolean) => void;
}

/**
 * Hook pour la création de nouveaux devis
 */
export const useQuoteCreate = ({
  onSuccess,
  onError,
  onCloseDialog
}: UseQuoteCreateProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateQuoteData } = useQuoteValidation();
  
  const handleSubmit = useCallback(async (
    quoteData: Partial<Quote>,
    items: QuoteItem[]
  ) => {
    console.log("handleSubmit called with data:", quoteData);
    console.log("Items:", items);
    
    try {
      // Valider les données requises
      if (!quoteData.contactId) {
        toast.error("Veuillez sélectionner un contact");
        throw new Error("Veuillez sélectionner un contact");
      }
      
      if (!quoteData.freelancerId) {
        toast.error("Un freelancer doit être assigné à ce devis");
        throw new Error("Un freelancer doit être assigné à ce devis");
      }
      
      if (!quoteData.validUntil) {
        toast.error("Veuillez spécifier une date de validité");
        throw new Error("Veuillez spécifier une date de validité");
      }
      
      if (!quoteData.totalAmount && quoteData.totalAmount !== 0) {
        toast.error("Le montant total est requis");
        throw new Error("Le montant total est requis");
      }
      
      if (!items || items.length === 0) {
        toast.error("Veuillez ajouter au moins un service au devis");
        throw new Error("Veuillez ajouter au moins un service au devis");
      }
      
      setIsSubmitting(true);
      console.log("Validation passed, proceeding with submission");
      
      // Formater les items pour l'envoi
      const formattedItems = items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        tax: item.tax || 0,
        serviceId: item.serviceId
      }));
      
      // Préparer les données du devis et s'assurer que status est un QuoteStatus
      const quoteDataObj = {
        contactId: quoteData.contactId,
        freelancerId: quoteData.freelancerId,
        totalAmount: quoteData.totalAmount,
        status: quoteData.status || QuoteStatus.DRAFT,
        validUntil: typeof quoteData.validUntil === 'string' 
          ? new Date(quoteData.validUntil) 
          : quoteData.validUntil,
        notes: quoteData.notes || "",
        folder: quoteData.folder || "general"
      };
      
      console.log("Calling quotesService.createQuote with:", quoteDataObj);
      
      // Appel avec les bons arguments
      const result = await quotesService.createQuote(quoteDataObj, formattedItems);
      console.log("Quote creation result:", result);
      
      if (result && result.id) {
        console.log("Quote created successfully with ID:", result.id);
        toast.success("Devis créé avec succès");
        
        if (onCloseDialog) {
          onCloseDialog(false);
        }
        
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
  }, [onSuccess, onError, onCloseDialog]);
  
  return {
    isSubmitting,
    handleSubmit
  };
};
