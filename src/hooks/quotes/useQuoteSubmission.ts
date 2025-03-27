
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Quote, QuoteItem } from "@/types";
import { useQuoteCreate } from "./submission/useQuoteCreate";
import { useQuoteUpdate } from "./submission/useQuoteUpdate";

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
      setIsQuoteSaved(true);
      if (id && onSuccess) onSuccess(id);
    },
    onError,
    onCloseDialog
  });
  
  const quoteUpdate = useQuoteUpdate({
    onSuccess: (id) => {
      setIsQuoteSaved(true);
      if (id && onSuccess) onSuccess(id);
    },
    onError,
    onCloseDialog
  });
  
  // Fonction pour créer un nouveau devis (compatibilité API)
  const handleSubmit = useCallback(async (
    quoteData: Partial<Quote>, 
    items: QuoteItem[]
  ) => {
    return await quoteCreate.handleSubmit(quoteData, items);
  }, [quoteCreate]);
  
  // Fonction pour éditer un devis existant (compatibilité API)
  const handleSubmitEdit = useCallback(async (
    quoteId: string, 
    quoteData: Partial<Quote>, 
    items: QuoteItem[]
  ) => {
    return await quoteUpdate.handleSubmitEdit(quoteId, quoteData, items);
  }, [quoteUpdate]);
  
  return {
    isSubmitting: quoteCreate.isSubmitting || quoteUpdate.isSubmitting,
    isQuoteSaved,
    submitQuote: handleSubmit,  // Maintien de la compatibilité avec l'ancien nom
    handleSubmit,
    handleSubmitEdit
  };
};
