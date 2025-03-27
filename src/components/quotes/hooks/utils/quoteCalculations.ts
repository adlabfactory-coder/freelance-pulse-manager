
import { QuoteItem } from "@/types";

/**
 * Calculates the total amount of a quote based on its items
 */
export const calculateTotalAmount = (items: (Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]) => {
  return items.reduce((total, item) => {
    if (!item.quantity || !item.unitPrice) return total;
    
    let itemTotal = item.quantity * item.unitPrice;
    
    if (item.tax && item.tax > 0) {
      itemTotal += (itemTotal * item.tax) / 100;
    }
    
    if (item.discount && item.discount > 0) {
      itemTotal -= (itemTotal * item.discount) / 100;
    }
    
    return total + itemTotal;
  }, 0);
};

/**
 * Validates that a quote form has all required fields filled
 */
export const validateQuoteForm = (
  contactId: string,
  freelancerId: string,
  validUntil: Date | null,
  items: (Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]
): { isValid: boolean; errorMessage?: string } => {
  if (!contactId) {
    return { 
      isValid: false, 
      errorMessage: "Veuillez sélectionner un client pour ce devis" 
    };
  }
  
  if (!freelancerId) {
    return { 
      isValid: false, 
      errorMessage: "Veuillez sélectionner un freelance pour ce devis" 
    };
  }
  
  if (!validUntil) {
    return { 
      isValid: false, 
      errorMessage: "Veuillez définir une date de validité pour ce devis" 
    };
  }
  
  if (items.length === 0) {
    return { 
      isValid: false, 
      errorMessage: "Veuillez ajouter au moins un élément au devis" 
    };
  }
  
  for (const item of items) {
    if (!item.description) {
      return { 
        isValid: false, 
        errorMessage: "Tous les éléments du devis doivent avoir une description" 
      };
    }
    
    if (!item.quantity || item.quantity <= 0) {
      return { 
        isValid: false, 
        errorMessage: "Tous les éléments du devis doivent avoir une quantité valide" 
      };
    }
    
    if (!item.unitPrice || item.unitPrice <= 0) {
      return { 
        isValid: false, 
        errorMessage: "Tous les éléments du devis doivent avoir un prix unitaire valide" 
      };
    }
  }
  
  return { isValid: true };
};
