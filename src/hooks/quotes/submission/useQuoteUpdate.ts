
import { useState, useCallback } from "react";
import { createQuotesService } from "@/services/supabase/quotes";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Quote, QuoteItem, QuoteStatus } from "@/types/quote";
import { useQuoteValidation } from "../validation/useQuoteValidation";

const quotesService = createQuotesService(supabase);

interface UseQuoteUpdateProps {
  onSuccess?: (id?: string) => void;
  onError?: (error: any) => void;
  onCloseDialog?: (open: boolean) => void;
}

/**
 * Hook pour la mise à jour des devis existants
 */
export const useQuoteUpdate = ({
  onSuccess,
  onError,
  onCloseDialog
}: UseQuoteUpdateProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateQuoteData } = useQuoteValidation();
  
  const handleSubmitEdit = useCallback(async (
    id: string, 
    quoteData: Partial<Quote>,
    items: QuoteItem[]
  ) => {
    console.log("handleSubmitEdit called for ID:", id);
    
    try {
      // Validation des données requises
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
      
      // Séparer les items selon leur statut (à ajouter, à mettre à jour, à supprimer)
      const itemsToAdd = items
        .filter(item => !item.id) // Nouveaux items qui n'ont pas encore d'ID
        .map(({ id, quoteId, ...item }) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          tax: item.tax || 0,
          serviceId: item.serviceId
        }));
        
      const itemsToUpdate = items
        .filter(item => !!item.id) // Items existants qui ont un ID
        .map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          tax: item.tax || 0
        }));
      
      // Dans une application réelle, vous suivriez les items à supprimer dans votre état
      const itemsToDelete: string[] = [];
      
      // Appel avec les bons arguments structurés
      const result = await quotesService.updateQuote(id, quoteDataObj, {
        add: itemsToAdd,
        update: itemsToUpdate,
        delete: itemsToDelete
      });
      
      if (result && result.id) {
        toast.success("Devis mis à jour avec succès");
        
        if (onCloseDialog) {
          onCloseDialog(false);
        }
        
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
  }, [onSuccess, onError, onCloseDialog]);
  
  return {
    isSubmitting,
    handleSubmitEdit
  };
};
