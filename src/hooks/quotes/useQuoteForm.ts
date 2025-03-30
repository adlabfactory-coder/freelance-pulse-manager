
import { useState, useCallback, useEffect } from "react";
import { Quote, QuoteStatus, QuoteItem } from "@/types/quote";
import { useQuoteDataLoader } from "./useQuoteDataLoader";
import { useQuoteItems } from "./useQuoteItems";
import { useQuoteData } from "./useQuoteData";
import { useQuoteSubmission } from "./useQuoteSubmission";
import { toast } from "sonner";

export interface UseQuoteFormProps {
  onSuccess?: (id?: string) => void;
  onError?: (error: any) => void;
  onCloseDialog?: (open: boolean) => void;
  onQuoteCreated?: (id?: string) => void;
  isEditing?: boolean;
  quoteId?: string;
}

export const useQuoteForm = ({
  onSuccess,
  onError,
  onCloseDialog,
  onQuoteCreated,
  isEditing = false,
  quoteId = ''
}: UseQuoteFormProps = {}) => {
  // Use custom hooks for different parts of the form
  const quoteData = useQuoteData();
  const { 
    loading, 
    contacts, 
    freelancers, 
    services, 
    loadData,
    loadQuoteData,
    error 
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
  
  // Pass proper props to useQuoteSubmission
  const { 
    isSubmitting, 
    isQuoteSaved, 
    handleSubmit, 
    handleSubmitEdit
  } = useQuoteSubmission({ 
    onSuccess, 
    onError: (error) => {
      console.error("Error in quote submission:", error);
      if (onError) onError(error);
      else toast.error("Erreur lors de la soumission: " + (error?.message || "Erreur inconnue"));
    }
  });

  // Chargement d'un devis spécifique
  const loadQuoteById = useCallback(async (id: string) => {
    try {
      console.log("loadQuoteById: Chargement du devis avec l'ID", id);
      const quote = await loadQuoteData(id);
      if (quote) {
        console.log("loadQuoteById: Devis chargé avec succès:", quote);
        quoteData.setContactId(quote.contactId);
        quoteData.setFreelancerId(quote.freelancerId);
        quoteData.setValidUntil(quoteData.convertToDate(quote.validUntil));
        quoteData.setStatus(quote.status);
        quoteData.setNotes(quote.notes || "");
        quoteData.setFolder(quote.folder || "general");
        resetItems(quote.items);
      } else {
        console.error("loadQuoteById: Devis non trouvé pour l'ID", id);
      }
    } catch (error) {
      console.error('Error loading quote data:', error);
      toast.error("Erreur lors du chargement du devis");
    }
  }, [quoteData, loadQuoteData, resetItems]);

  // Récupération complète des données du devis
  const getQuoteData = useCallback(() => {
    // Récupérer les éléments valides pour s'assurer qu'ils sont complets
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
        id: item.id || "",  // Assurer que l'ID est présent ou une chaîne vide
        quoteId: item.quoteId || "",  // Assurer que quoteId est présent ou une chaîne vide
        serviceId: item.serviceId
      }));
    
    return {
      ...quoteData.getQuoteData(),
      totalAmount,
      items: validItems
    };
  }, [quoteData, totalAmount, items]);

  // Cette propriété est utilisée pour l'affichage uniquement - on renvoie les items bruts
  const quoteDataForDisplay = {
    ...quoteData.getQuoteData(),
    totalAmount,
    items: items
  };

  // Fonction spécifique pour gérer la soumission de l'édition
  const handleSubmitEditWrapper = useCallback((id: string) => {
    console.log("Handling edit submit for ID:", id);
    const data = getQuoteData();
    
    // Convertir les éléments en QuoteItem complets en veillant à ce que toutes les propriétés nécessaires soient présentes
    const validQuoteItems = allItems
      .filter(item => !item.toDelete)
      .map(item => ({
        id: item.id || '',
        quoteId: item.quoteId || '',
        description: item.description || '',
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        tax: item.tax || 0,
        discount: item.discount || 0,
        serviceId: item.serviceId
      }));
    
    return handleSubmitEdit(id, data, validQuoteItems);
  }, [getQuoteData, handleSubmitEdit, allItems]);

  // Fonction simplifiée pour mettre à jour les données du devis
  const setQuoteData = useCallback((data: Partial<Quote>) => {
    console.log("setQuoteData called with:", data);
    
    if (data.contactId !== undefined) quoteData.setContactId(data.contactId);
    if (data.freelancerId !== undefined) quoteData.setFreelancerId(data.freelancerId);
    if (data.validUntil !== undefined) {
      if (typeof data.validUntil === 'string') {
        quoteData.setValidUntil(new Date(data.validUntil));
      } else {
        quoteData.setValidUntil(data.validUntil);
      }
    }
    if (data.status !== undefined) quoteData.setStatus(data.status as QuoteStatus);
    if (data.notes !== undefined) quoteData.setNotes(data.notes);
    if (data.folder !== undefined) quoteData.setFolder(data.folder);
  }, [quoteData]);

  return {
    // Basic quote data from useQuoteData
    contactId: quoteData.contactId,
    setContactId: quoteData.setContactId,
    freelancerId: quoteData.freelancerId,
    setFreelancerId: quoteData.setFreelancerId,
    validUntil: quoteData.validUntil,
    setValidUntil: quoteData.setValidUntil,
    status: quoteData.status,
    setStatus: quoteData.setStatus,
    notes: quoteData.notes,
    setNotes: quoteData.setNotes,
    folder: quoteData.folder,
    setFolder: quoteData.setFolder,
    
    // Items management from useQuoteItems
    items,
    currentItem,
    setCurrentItem,
    addItem,
    removeItem,
    updateItem,
    totalAmount,
    handleAddItem: addItem,
    handleRemoveItem: removeItem,
    
    // Form state from useQuoteSubmission
    isSubmitting,
    isQuoteSaved,
    
    // Data loading from useQuoteDataLoader
    loading,
    contacts,
    freelancers,
    services,
    loadData,
    loadQuoteData: loadQuoteById,
    
    // Form actions
    handleSubmit,
    handleSubmitEdit: handleSubmitEditWrapper,
    
    // Helper functions
    quoteData: quoteDataForDisplay,
    setQuoteData,
    
    // Ajout explicite de la propriété error pour corriger l'erreur TypeScript
    error
  };
};
