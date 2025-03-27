
import { useState, useCallback } from "react";
import { createQuotesService } from "@/services/supabase/quotes";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Quote, QuoteItem } from "@/types/quote";
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
      
      setIsSubmitting(true);
      
      // Formater les items pour l'envoi
      const formattedItems = items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        tax: item.tax || 0,
        serviceId: item.serviceId
      }));
      
      // Préparer les données du devis
      const quoteDataObj = {
        contactId: quoteData.contactId,
        freelancerId: quoteData.freelancerId,
        totalAmount: quoteData.totalAmount,
        status: quoteData.status || "DRAFT",
        validUntil: quoteData.validUntil,
        notes: quoteData.notes || "",
        folder: quoteData.folder || "general"
      };
      
      // Appel avec les bons arguments
      const result = await quotesService.createQuote(quoteDataObj, formattedItems);
      
      if (result && result.id) {
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
