
import { useState } from "react";
import { useQuoteCreate } from "./submission/useQuoteCreate";
import { useQuoteUpdate } from "./submission/useQuoteUpdate";

export interface UseQuoteSubmissionProps {
  onSuccess?: (id?: string) => void;
  onCloseDialog?: (open: boolean) => void;
  onQuoteCreated?: (id?: string) => void;
}

/**
 * Hook pour gérer la soumission et mise à jour des devis
 */
export const useQuoteSubmission = (props: UseQuoteSubmissionProps = {}) => {
  const [isQuoteSaved, setIsQuoteSaved] = useState(false);
  
  // Utiliser les hooks spécialisés pour la création et la mise à jour
  const { isSubmitting: isSubmittingCreate, handleSubmit } = useQuoteCreate(props);
  const { isSubmitting: isSubmittingUpdate, handleSubmitEdit } = useQuoteUpdate(props);
  
  // Déterminer si une opération est en cours
  const isSubmitting = isSubmittingCreate || isSubmittingUpdate;
  
  return {
    isSubmitting,
    isQuoteSaved,
    handleSubmit,
    handleSubmitEdit
  };
};
