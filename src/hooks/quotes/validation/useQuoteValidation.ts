
import { useState } from "react";
import { toast } from "sonner";
import { Quote, QuoteItem } from "@/types/quote";

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
    items: QuoteItem[]
  ): { isValid: boolean; errorMessage?: string } => {
    try {
      // Validation des entrées
      const safeContactId = validateId(contactId);
      const safeFreelancerId = validateId(freelancerId);
      const safeValidUntil = validUntil ? validateDate(validUntil) : new Date();
      
      if (!safeContactId) {
        const message = "Le contact est obligatoire";
        setValidationErrors(message);
        return { isValid: false, errorMessage: message };
      }
      
      if (!safeFreelancerId) {
        const message = "Le freelance est obligatoire";
        setValidationErrors(message);
        return { isValid: false, errorMessage: message };
      }
      
      if (!items || items.length === 0) {
        const message = "Veuillez ajouter au moins un service au devis";
        setValidationErrors(message);
        return { isValid: false, errorMessage: message };
      }
      
      setValidationErrors(null);
      return { isValid: true };
    } catch (error: any) {
      const errorMessage = `Erreur de validation: ${error.message || 'Erreur inconnue'}`;
      console.error(errorMessage);
      setValidationErrors(errorMessage);
      return { isValid: false, errorMessage };
    }
  };
  
  return {
    validationErrors,
    validateDate,
    validateQuoteData
  };
};
