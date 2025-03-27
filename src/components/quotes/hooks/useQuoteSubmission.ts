
import { useQuoteSubmission as useBaseQuoteSubmission, UseQuoteSubmissionProps } from '@/hooks/quotes/useQuoteSubmission';
import { Quote, QuoteItem } from '@/types';

// Réexport simple pour maintenir la compatibilité
export const useQuoteSubmission = (props: UseQuoteSubmissionProps = {}) => {
  const baseHook = useBaseQuoteSubmission(props);
  
  return {
    ...baseHook,
    // Nous nous assurons que la signature des fonctions correspond à celles de baseHook
    handleSubmit: (quoteData: Partial<Quote>, items: QuoteItem[]) => 
      baseHook.handleSubmit(quoteData, items),
    
    handleSubmitEdit: (quoteId: string, quoteData: Partial<Quote>, items: QuoteItem[]) => 
      baseHook.handleSubmitEdit(quoteId, quoteData, items)
  };
};
