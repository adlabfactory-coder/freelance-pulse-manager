
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Quote, QuoteItem } from "@/types";
import { useQuoteCreate } from "./submission/useQuoteCreate";
import { useQuoteUpdate } from "./submission/useQuoteUpdate";
import { toast } from "sonner";

export interface UseQuoteSubmissionProps {
  onSuccess?: (quoteId: string) => void;
  onError?: (error: any) => void;
  onCloseDialog?: (open: boolean) => void;
}

/**
 * Hook principal pour la gestion des soumissions de devis (création et mise à jour)
 * Sert de façade pour unifier l'interface des hooks spécialisés
 */
export const useQuoteSubmission = ({ 
  onSuccess, 
  onError,
  onCloseDialog
}: UseQuoteSubmissionProps = {}) => {
  const [isQuoteSaved, setIsQuoteSaved] = useState(false);
  const { user } = useAuth();
  
  // Utiliser les hooks spécialisés
  const quoteCreate = useQuoteCreate({
    onSuccess: (id) => {
      if (id) {
        console.log("useQuoteSubmission: Devis créé avec succès, ID:", id);
        setIsQuoteSaved(true);
        if (onSuccess) onSuccess(id);
      } else {
        console.error("useQuoteSubmission: ID de devis manquant après création");
      }
    },
    onError: (error) => {
      console.error("useQuoteSubmission: Erreur lors de la création du devis:", error);
      if (onError) onError(error);
      else toast.error("Erreur lors de la création du devis");
    },
    onCloseDialog
  });
  
  const quoteUpdate = useQuoteUpdate({
    onSuccess: (id) => {
      if (id) {
        console.log("useQuoteSubmission: Devis mis à jour avec succès, ID:", id);
        setIsQuoteSaved(true);
        if (onSuccess) onSuccess(id);
      } else {
        console.error("useQuoteSubmission: ID de devis manquant après mise à jour");
      }
    },
    onError: (error) => {
      console.error("useQuoteSubmission: Erreur lors de la mise à jour du devis:", error);
      if (onError) onError(error);
      else toast.error("Erreur lors de la mise à jour du devis");
    },
    onCloseDialog
  });
  
  // Fonction pour créer un nouveau devis (compatibilité API)
  const handleSubmit = useCallback(async (
    quoteData: Partial<Quote>, 
    items: QuoteItem[]
  ) => {
    console.log("useQuoteSubmission.handleSubmit: Données:", quoteData);
    console.log("useQuoteSubmission.handleSubmit: Items:", items);
    
    // Validation de base
    if (!quoteData.contactId) {
      console.error("useQuoteSubmission: ContactId manquant");
      toast.error("Un contact doit être sélectionné pour le devis");
      return null;
    }
    
    if (!quoteData.freelancerId) {
      console.error("useQuoteSubmission: FreelancerId manquant");
      toast.error("Un commercial doit être assigné au devis");
      return null;
    }
    
    try {
      return await quoteCreate.handleSubmit(quoteData, items);
    } catch (error) {
      console.error("useQuoteSubmission.handleSubmit: Erreur:", error);
      if (onError) onError(error);
      return null;
    }
  }, [quoteCreate, onError]);
  
  // Fonction pour éditer un devis existant (compatibilité API)
  const handleSubmitEdit = useCallback(async (
    quoteId: string, 
    quoteData: Partial<Quote>, 
    items: QuoteItem[]
  ) => {
    console.log("useQuoteSubmission.handleSubmitEdit: ID:", quoteId);
    console.log("useQuoteSubmission.handleSubmitEdit: Données:", quoteData);
    try {
      return await quoteUpdate.handleSubmitEdit(quoteId, quoteData, items);
    } catch (error) {
      console.error("useQuoteSubmission.handleSubmitEdit: Erreur:", error);
      if (onError) onError(error);
      return null;
    }
  }, [quoteUpdate, onError]);
  
  return {
    isSubmitting: quoteCreate.isSubmitting || quoteUpdate.isSubmitting,
    isQuoteSaved,
    submitQuote: handleSubmit,  // Maintien de la compatibilité avec l'ancien nom
    handleSubmit,
    handleSubmitEdit
  };
};
