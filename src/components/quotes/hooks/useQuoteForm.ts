
import { useState, useCallback, useEffect } from "react";
import { Quote, QuoteStatus } from "@/types";
import { useQuoteDataLoader } from "./useQuoteDataLoader";
import { useQuoteItems } from "./useQuoteItems";
import { useQuoteSubmission } from "./useQuoteSubmission";
import { createQuotesService } from "@/services/supabase/quotes";
import { supabase } from "@/lib/supabase-client";

// Create a quotes service instance
const quotesService = createQuotesService(supabase);

export interface UseQuoteFormProps {
  onSuccess?: (id?: string) => void;
  onCloseDialog?: (open: boolean) => void;
  onQuoteCreated?: (id?: string) => void;
  isEditing?: boolean;
  quoteId?: string;
}

export const useQuoteForm = ({
  onSuccess,
  onCloseDialog,
  onQuoteCreated,
  isEditing = false,
  quoteId = ''
}: UseQuoteFormProps = {}) => {
  // Quote fields state
  const [contactId, setContactId] = useState<string>("");
  const [freelancerId, setFreelancerId] = useState<string>("");
  const [validUntil, setValidUntil] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [status, setStatus] = useState<QuoteStatus>(QuoteStatus.DRAFT);
  const [notes, setNotes] = useState<string>("");

  // Use custom hooks
  const { 
    loading, 
    contacts, 
    freelancers, 
    services, 
    loadData 
  } = useQuoteDataLoader();
  
  const { 
    items, 
    allItems,
    currentItem, 
    setCurrentItem, 
    addItem, 
    removeItem, 
    updateItem, 
    totalAmount,
    resetItems
  } = useQuoteItems();
  
  const { 
    isSubmitting, 
    isQuoteSaved, 
    handleSubmit, 
    handleSubmitEdit 
  } = useQuoteSubmission({ onSuccess, onCloseDialog, onQuoteCreated });

  // Load a specific quote for editing
  const loadQuoteData = useCallback(async (id: string) => {
    try {
      const quote = await quotesService.fetchQuoteById(id);
      if (quote) {
        setContactId(quote.contactId);
        setFreelancerId(quote.freelancerId);
        setValidUntil(quote.validUntil);
        setStatus(quote.status);
        setNotes(quote.notes || "");
        resetItems(quote.items);
      }
    } catch (error) {
      console.error('Error loading quote data:', error);
    }
  }, [resetItems]);

  // Get the complete quote data
  const getQuoteData = useCallback(() => {
    return {
      contactId,
      freelancerId,
      validUntil,
      status,
      notes,
      totalAmount,
      items: items.filter(item => {
        // Vérifier que l'élément a toutes les propriétés requises pour être un QuoteItem valide
        return (
          item &&
          item.description !== undefined &&
          item.quantity !== undefined &&
          item.unitPrice !== undefined
        );
      })
    };
  }, [contactId, freelancerId, validUntil, status, notes, totalAmount, items]);

  // Handle form submission
  const submitForm = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const quoteData = getQuoteData();
    return handleSubmit(quoteData, allItems);
  }, [getQuoteData, handleSubmit, allItems]);

  // Set the entire quote data at once
  const setQuoteData = useCallback((data: Partial<Quote>) => {
    if (data.contactId) setContactId(data.contactId);
    if (data.freelancerId) setFreelancerId(data.freelancerId);
    if (data.validUntil) setValidUntil(data.validUntil);
    if (data.status) setStatus(data.status);
    if (data.notes !== undefined) setNotes(data.notes);
    if (data.items) resetItems(data.items);
  }, [resetItems]);

  return {
    // Basic quote data
    contactId,
    setContactId,
    freelancerId,
    setFreelancerId,
    validUntil,
    setValidUntil,
    status,
    setStatus,
    notes,
    setNotes,
    
    // Items management
    items,
    currentItem,
    setCurrentItem,
    addItem,
    removeItem: removeItem,
    updateItem,
    totalAmount,
    handleAddItem: addItem,
    handleRemoveItem: removeItem,
    
    // Form state
    isSubmitting,
    isQuoteSaved,
    
    // Data loading
    loading,
    contacts,
    freelancers,
    services,
    loadData,
    loadQuoteData,
    
    // Form actions
    handleSubmit: submitForm,
    handleSubmitEdit: (id: string) => handleSubmitEdit(id, getQuoteData(), allItems),
    
    // Helper functions
    quoteData: getQuoteData(),
    setQuoteData
  };
};
