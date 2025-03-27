
import { useState } from "react";
import { toast } from "sonner";
import { Quote, QuoteItem } from "@/types/quote";
import { validateQuoteForm } from "@/components/quotes/hooks/utils/quoteCalculations";

/**
 * Hook pour la validation des données de devis
 */
export const useQuoteValidation = () => {
  const [validationErrors, setValidationErrors] = useState<string | null>(null);
  
  /**
   * Convertit une chaîne de date en objet Date
   */
  const validateDate = (date: string | Date): Date => {
    return typeof date === 'string' ? new Date(date) : date;
  };
  
  /**
   * Valide les données du devis
   */
  const validateQuoteData = (
    contactId: string, 
    freelancerId: string, 
    validUntil: string | Date,
    items: (Partial<QuoteItem> | QuoteItem)[]
  ): { isValid: boolean } => {
    const validationDate = validateDate(validUntil);
    const validation = validateQuoteForm(
      contactId,
      freelancerId,
      validationDate,
      items
    );
    
    if (!validation.isValid && validation.errorMessage) {
      toast.error(validation.errorMessage);
      setValidationErrors(validation.errorMessage);
      return { isValid: false };
    }
    
    setValidationErrors(null);
    return { isValid: true };
  };
  
  return {
    validationErrors,
    validateDate,
    validateQuoteData
  };
};
