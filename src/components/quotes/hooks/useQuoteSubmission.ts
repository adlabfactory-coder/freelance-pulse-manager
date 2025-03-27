
import { useQuoteSubmission as useBaseQuoteSubmission, UseQuoteSubmissionProps } from '@/hooks/quotes/useQuoteSubmission';
import { Quote, QuoteItem } from '@/types';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { createQuote } from '@/services/quote-service';

// Hook amélioré avec journalisation et gestion d'erreurs
export const useQuoteSubmission = (props?: UseQuoteSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const baseHook = useBaseQuoteSubmission(props);
  
  // Fonction wrapper pour journaliser et valider avant de soumettre
  const enhancedSubmit = useCallback(async (
    quoteData: Partial<Quote>, 
    items: QuoteItem[]
  ) => {
    console.log("useQuoteSubmission: Soumission du devis avec données:", quoteData);
    console.log("useQuoteSubmission: Éléments du devis:", items);
    
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
      setIsSubmitting(true);
      // Utiliser le hook de base pour soumettre
      const result = await baseHook.handleSubmit(quoteData, items);
      console.log("useQuoteSubmission: Résultat de la soumission:", result);
      return result;
    } catch (error) {
      console.error("useQuoteSubmission: Erreur lors de la soumission:", error);
      toast.error("Erreur lors de la création du devis");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [baseHook]);
  
  // Retourner les fonctions et états originaux, mais avec notre fonction améliorée
  return {
    ...baseHook,
    handleSubmit: enhancedSubmit,
    isSubmitting: isSubmitting || baseHook.isSubmitting,
  };
};
