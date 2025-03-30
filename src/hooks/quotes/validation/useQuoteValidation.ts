
import { toast } from "sonner";
import { Quote, QuoteItem } from "@/types";

/**
 * Hook pour valider les données d'un devis
 */
export const useQuoteValidation = () => {
  /**
   * Valide les données d'un devis
   */
  const validateQuoteData = (quoteData: Partial<Quote>, items: QuoteItem[]) => {
    const errors: string[] = [];
    
    console.log("Validating quote data:", quoteData);
    console.log("Validating quote items:", items);
    
    if (!quoteData.contactId) {
      errors.push("Un contact doit être sélectionné");
    }
    
    if (!quoteData.freelancerId) {
      errors.push("Un commercial doit être assigné");
    }
    
    if (!quoteData.validUntil) {
      errors.push("Une date de validité est requise");
    }
    
    if (items.length === 0) {
      errors.push("Au moins un article doit être ajouté au devis");
    }
    
    const isValid = errors.length === 0;
    
    if (!isValid) {
      errors.forEach(error => toast.error(error));
    }
    
    return {
      isValid,
      errors
    };
  };
  
  return {
    validateQuoteData
  };
};
