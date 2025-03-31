
import { useQuoteSubmission as useBaseQuoteSubmission, UseQuoteSubmissionProps } from '@/hooks/quotes/useQuoteSubmission';
import { Quote, QuoteItem } from '@/types';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { createQuote } from '@/services/quote-service';
import { useAuth } from '@/hooks/use-auth';

// Hook amélioré avec journalisation, validation et gestion des utilisateurs démo
export const useQuoteSubmission = (props?: UseQuoteSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const baseHook = useBaseQuoteSubmission(props);
  const { user } = useAuth();
  
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
    
    // Si le freelancerId est manquant, utiliser l'utilisateur actuel
    if (!quoteData.freelancerId && user?.id) {
      console.log(`useQuoteSubmission: Utilisation de l'ID utilisateur actuel: ${user.id}`);
      quoteData.freelancerId = user.id;
    }
    
    if (!quoteData.freelancerId) {
      console.error("useQuoteSubmission: FreelancerId manquant");
      toast.error("Un commercial doit être assigné au devis");
      return null;
    }
    
    // Vérifier si nous utilisons un ID de démonstration non valide
    if (quoteData.freelancerId === 'freelancer-uuid' || 
        !(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(quoteData.freelancerId))) {
      console.log("useQuoteSubmission: ID utilisateur non valide, création d'un devis de démonstration");
      
      // Pour les démonstrations, retourner un devis fictif avec ID
      const mockQuote: Quote = {
        id: `demo-${Date.now()}`,
        contactId: quoteData.contactId,
        freelancerId: quoteData.freelancerId || 'freelancer-uuid',
        totalAmount: quoteData.totalAmount || 0,
        status: quoteData.status || 'draft',
        validUntil: quoteData.validUntil || new Date(),
        notes: quoteData.notes,
        folder: quoteData.folder || 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      toast.success("Devis de démonstration créé");
      return mockQuote;
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
  }, [baseHook, user]);
  
  // Retourner les fonctions et états originaux, mais avec notre fonction améliorée
  return {
    ...baseHook,
    handleSubmit: enhancedSubmit,
    isSubmitting: isSubmitting || baseHook.isSubmitting,
  };
};
