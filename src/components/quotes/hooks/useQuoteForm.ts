
import { useQuoteForm as useBaseQuoteForm, UseQuoteFormProps } from '@/hooks/quotes/useQuoteForm';

// Réexport simple pour maintenir la compatibilité
export const useQuoteForm = (props: UseQuoteFormProps = {}) => {
  return useBaseQuoteForm(props);
};
