
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
    try {
      return typeof date === 'string' ? new Date(date) : date;
    } catch (error) {
      console.error("Erreur de format de date:", error);
      return new Date(); // Date par défaut en cas d'erreur
    }
  };
  
  /**
   * Vérifie que l'ID est une chaîne valide
   */
  const validateId = (id: string | undefined): string => {
    if (!id) {
      console.warn("ID manquant, utilisation d'une chaîne vide");
      return '';
    }
    return id.trim();
  };
  
  /**
   * Valide les données du devis
   */
  const validateQuoteData = (
    contactId: string | undefined, 
    freelancerId: string | undefined, 
    validUntil: string | Date | undefined,
    items: (Partial<QuoteItem> | QuoteItem)[]
  ): { isValid: boolean } => {
    try {
      // Validation des entrées
      const safeContactId = validateId(contactId);
      const safeFreelancerId = validateId(freelancerId);
      const safeValidUntil = validUntil ? validateDate(validUntil) : new Date();
      const safeItems = items || [];
      
      if (!safeContactId) {
        toast.error("Le contact est obligatoire");
        setValidationErrors("Le contact est obligatoire");
        return { isValid: false };
      }
      
      if (!safeFreelancerId) {
        toast.error("Le freelance est obligatoire");
        setValidationErrors("Le freelance est obligatoire");
        return { isValid: false };
      }
      
      // Utiliser la fonction de validation existante
      const validation = validateQuoteForm(
        safeContactId,
        safeFreelancerId,
        safeValidUntil,
        safeItems
      );
      
      if (!validation.isValid && validation.errorMessage) {
        toast.error(validation.errorMessage);
        setValidationErrors(validation.errorMessage);
        return { isValid: false };
      }
      
      setValidationErrors(null);
      return { isValid: true };
    } catch (error: any) {
      const errorMessage = `Erreur de validation: ${error.message || 'Erreur inconnue'}`;
      console.error(errorMessage);
      toast.error(errorMessage);
      setValidationErrors(errorMessage);
      return { isValid: false };
    }
  };
  
  return {
    validationErrors,
    validateDate,
    validateQuoteData
  };
};
