
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
  const [folder, setFolder] = useState<string>("general");

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
        setFolder(quote.folder || "general");
        resetItems(quote.items);
      }
    } catch (error) {
      console.error('Error loading quote data:', error);
    }
  }, [resetItems]);

  // Get the complete quote data with type safety
  const getQuoteData = useCallback(() => {
    // Filtrer les éléments pour s'assurer qu'ils sont complets et valides
    const validItems = items
      .filter(item => 
        item && 
        item.description !== undefined && 
        item.quantity !== undefined && 
        item.unitPrice !== undefined
      )
      .map(item => ({
        description: item.description!,
        quantity: item.quantity!,
        unitPrice: item.unitPrice!,
        tax: item.tax || 0,
        discount: item.discount || 0,
        id: item.id,
        quoteId: item.quoteId,
        serviceId: item.serviceId
      }));
    
    return {
      contactId,
      freelancerId,
      validUntil,
      status,
      notes,
      folder,
      totalAmount,
      items: validItems
    };
  }, [contactId, freelancerId, validUntil, status, notes, folder, totalAmount, items]);

  // Handle form submission
  const submitForm = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const quoteData = getQuoteData();
    console.log("Submit form with data:", quoteData);
    return handleSubmit(quoteData, allItems);
  }, [getQuoteData, handleSubmit, allItems]);

  // Set the entire quote data at once
  const setQuoteData = useCallback((data: Partial<Quote>) => {
    if (data.contactId) setContactId(data.contactId);
    if (data.freelancerId) setFreelancerId(data.freelancerId);
    if (data.validUntil) setValidUntil(data.validUntil);
    if (data.status) setStatus(data.status);
    if (data.notes !== undefined) setNotes(data.notes);
    if (data.folder) setFolder(data.folder);
    if (data.items) resetItems(data.items);
  }, [resetItems]);

  // Cette propriété est utilisée pour l'affichage uniquement - on renvoie les items bruts
  const quoteDataForDisplay = {
    contactId,
    freelancerId,
    validUntil,
    status,
    notes,
    folder,
    totalAmount,
    items: items
  };

  // Fonction spécifique pour gérer la soumission de l'édition
  const handleSubmitEditWrapper = useCallback((id: string) => {
    console.log("Handling edit submit for ID:", id);
    const quoteData = getQuoteData();
    return handleSubmitEdit(id, quoteData, allItems);
  }, [getQuoteData, handleSubmitEdit, allItems]);

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
    folder,
    setFolder,
    
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
    handleSubmitEdit: handleSubmitEditWrapper,
    
    // Helper functions
    quoteData: quoteDataForDisplay,
    setQuoteData
  };
};
