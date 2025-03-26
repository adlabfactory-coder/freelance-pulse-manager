
import { useState } from "react";
import { format } from "date-fns";
import { createQuotesService } from "@/services/supabase/quotes";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Quote, QuoteItem, QuoteStatus } from "@/types";

// Initialiser le service
const quotesService = createQuotesService(supabase);

// Function to calculate the total amount of a quote
const calculateTotalAmount = (items: Partial<QuoteItem>[]) => {
  return items.reduce((total, item) => {
    if (!item.quantity || !item.unitPrice) return total;
    
    let itemTotal = item.quantity * item.unitPrice;
    
    // Apply tax if present
    if (item.tax && item.tax > 0) {
      itemTotal += (itemTotal * item.tax) / 100;
    }
    
    // Apply discount if present
    if (item.discount && item.discount > 0) {
      itemTotal -= (itemTotal * item.discount) / 100;
    }
    
    return total + itemTotal;
  }, 0);
};

export const useQuoteForm = (
  initialData?: Partial<Quote>,
  onSuccess?: (quoteId: string) => void
) => {
  // State for form fields
  const [contactId, setContactId] = useState<string>(initialData?.contactId || "");
  const [freelancerId, setFreelancerId] = useState<string>(initialData?.freelancerId || "");
  const [validUntil, setValidUntil] = useState<Date>(
    initialData?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [status, setStatus] = useState<QuoteStatus>(initialData?.status || "draft");
  const [notes, setNotes] = useState<string>(initialData?.notes || "");
  const [items, setItems] = useState<(Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]>(
    initialData?.items || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSaved, setIsQuoteSaved] = useState(false);
  
  // Form validation
  const isFormValid = () => {
    if (!contactId) {
      toast.error("Veuillez sélectionner un client pour ce devis");
      return false;
    }
    
    if (!freelancerId) {
      toast.error("Veuillez sélectionner un freelance pour ce devis");
      return false;
    }
    
    if (!validUntil) {
      toast.error("Veuillez définir une date de validité pour ce devis");
      return false;
    }
    
    if (items.length === 0) {
      toast.error("Veuillez ajouter au moins un élément au devis");
      return false;
    }
    
    for (const item of items) {
      if (!item.description) {
        toast.error("Tous les éléments du devis doivent avoir une description");
        return false;
      }
      
      if (!item.quantity || item.quantity <= 0) {
        toast.error("Tous les éléments du devis doivent avoir une quantité valide");
        return false;
      }
      
      if (!item.unitPrice || item.unitPrice <= 0) {
        toast.error("Tous les éléments du devis doivent avoir un prix unitaire valide");
        return false;
      }
    }
    
    return true;
  };
  
  // Add a new item to the quote
  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        tax: 20, // Default tax rate
        discount: 0,
        isNew: true
      }
    ]);
  };
  
  // Update an existing item
  const updateItem = (index: number, updatedItem: Partial<QuoteItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updatedItem };
    setItems(newItems);
  };
  
  // Remove an item from the quote
  const removeItem = (index: number) => {
    const newItems = [...items];
    
    if (newItems[index].id) {
      // Mark existing items for deletion instead of removing them from the array
      newItems[index] = { ...newItems[index], toDelete: true };
      setItems(newItems);
    } else {
      // Remove new items directly
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };
  
  // Calculate the total amount
  const totalAmount = calculateTotalAmount(items.filter(item => !item.toDelete));
  
  // Submit the form to create or update a quote
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    
    try {
      if (initialData?.id) {
        // Update existing quote
        console.log("Mise à jour du devis", initialData.id);
        
        const itemsToAdd = items.filter(item => item.isNew && !item.toDelete).map(({ isNew, toDelete, id, ...item }) => item as Omit<QuoteItem, 'id' | 'quoteId'>);
        const itemsToUpdate = items.filter(item => item.id && !item.isNew && !item.toDelete).map(({ isNew, toDelete, ...item }) => item as Pick<QuoteItem, 'id'> & Partial<Omit<QuoteItem, 'id' | 'quoteId'>>);
        const itemsToDelete = items.filter(item => item.toDelete && item.id).map(item => item.id as string);
        
        const updatedQuote = await quotesService.updateQuote(
          initialData.id,
          {
            contactId,
            freelancerId,
            validUntil,
            status,
            notes,
            totalAmount
          },
          {
            add: itemsToAdd,
            update: itemsToUpdate,
            delete: itemsToDelete
          }
        );
        
        if (updatedQuote) {
          toast.success("Devis mis à jour avec succès");
          setIsQuoteSaved(true);
          
          if (onSuccess) {
            onSuccess(updatedQuote.id);
          }
        }
      } else {
        // Create new quote
        console.log("Création d'un nouveau devis");
        
        const validItems = items
          .filter(item => !item.toDelete)
          .map(({ isNew, toDelete, id, ...item }) => item as Omit<QuoteItem, 'id' | 'quoteId'>);
        
        const newQuote = await quotesService.createQuote(
          {
            contactId,
            freelancerId,
            validUntil,
            status,
            notes,
            totalAmount
          },
          validItems
        );
        
        if (newQuote) {
          toast.success("Devis créé avec succès");
          setIsQuoteSaved(true);
          
          if (onSuccess) {
            onSuccess(newQuote.id);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du devis:", error);
      toast.error("Une erreur est survenue lors de la sauvegarde du devis");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
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
    items: items.filter(item => !item.toDelete),
    addItem,
    updateItem,
    removeItem,
    totalAmount,
    isSubmitting,
    isQuoteSaved,
    handleSubmit
  };
};
