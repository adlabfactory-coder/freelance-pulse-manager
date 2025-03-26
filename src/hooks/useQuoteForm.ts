
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { createQuotesService } from "@/services/supabase/quotes";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Quote, QuoteItem, QuoteStatus } from "@/types";
import { Contact } from "@/services/contacts/types";
import { Service } from "@/types/services";
import { User } from "@/types";
import { fetchServices } from "@/services/services-service";

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
  // State for form fields
  const [contactId, setContactId] = useState<string>("");
  const [freelancerId, setFreelancerId] = useState<string>("");
  const [validUntil, setValidUntil] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [status, setStatus] = useState<QuoteStatus>(QuoteStatus.DRAFT);
  const [notes, setNotes] = useState<string>("");
  const [items, setItems] = useState<(Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSaved, setIsQuoteSaved] = useState(false);
  
  // State for loading data
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  // Current item being added
  const [currentItem, setCurrentItem] = useState<Partial<QuoteItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    tax: 20, // Default tax rate
    discount: 0,
  });
  
  // Load data (contacts, freelancers, services)
  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .is('deleted_at', null);
      
      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
      } else {
        setContacts(contactsData || []);
      }
      
      // Fetch freelancers
      const { data: freelancersData, error: freelancersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'freelancer');
      
      if (freelancersError) {
        console.error('Error fetching freelancers:', freelancersError);
      } else {
        setFreelancers(freelancersData || []);
      }
      
      // Fetch services
      const servicesData = await fetchServices();
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error("Une erreur est survenue lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };
  
  // Load quote data for editing
  const loadQuoteData = async (id: string) => {
    setLoading(true);
    try {
      const quote = await quotesService.fetchQuoteById(id);
      if (quote) {
        setContactId(quote.contactId);
        setFreelancerId(quote.freelancerId);
        setValidUntil(quote.validUntil);
        setStatus(quote.status);
        setNotes(quote.notes || "");
        setItems(quote.items.map(item => ({
          ...item,
          isNew: false,
          toDelete: false
        })));
      }
    } catch (error) {
      console.error('Error loading quote data:', error);
      toast.error("Une erreur est survenue lors du chargement du devis");
    } finally {
      setLoading(false);
    }
  };
  
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
  const handleAddItem = () => {
    if (!currentItem.description || !currentItem.quantity || !currentItem.unitPrice) {
      toast.error("Veuillez remplir tous les champs de l'article");
      return;
    }
    
    setItems([
      ...items,
      {
        ...currentItem,
        isNew: true
      }
    ]);
    
    // Reset current item
    setCurrentItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      tax: 20, // Default tax rate
      discount: 0,
    });
  };
  
  // Remove an item from the quote
  const handleRemoveItem = (index: number) => {
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
  
  // Get quote data for submit
  const getQuoteData = (): Omit<Quote, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
      contactId,
      freelancerId,
      validUntil,
      status,
      notes,
      totalAmount,
      items: items.filter(item => !item.toDelete) as QuoteItem[]
    };
  };
  
  // Submit the form to create a quote
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create new quote
      console.log("Création d'un nouveau devis");
      
      const validItems = items
        .filter(item => !item.toDelete)
        .map(({ isNew, toDelete, id, ...item }) => item as Omit<QuoteItem, 'id' | 'quoteId'>);
      
      const quoteData = getQuoteData();
      const newQuote = await quotesService.createQuote(
        quoteData,
        validItems
      );
      
      if (newQuote) {
        toast.success("Devis créé avec succès");
        setIsQuoteSaved(true);
        
        if (onCloseDialog) onCloseDialog(false);
        if (onQuoteCreated) onQuoteCreated(newQuote.id);
        if (onSuccess) onSuccess(newQuote.id);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du devis:", error);
      toast.error("Une erreur est survenue lors de la sauvegarde du devis");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle editing a quote
  const handleSubmitEdit = async (id: string) => {
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Mise à jour du devis", id);
      
      const itemsToAdd = items.filter(item => item.isNew && !item.toDelete).map(({ isNew, toDelete, id, ...item }) => item as Omit<QuoteItem, 'id' | 'quoteId'>);
      const itemsToUpdate = items.filter(item => item.id && !item.isNew && !item.toDelete).map(({ isNew, toDelete, ...item }) => item as Pick<QuoteItem, 'id'> & Partial<Omit<QuoteItem, 'id' | 'quoteId'>>);
      const itemsToDelete = items.filter(item => item.toDelete && item.id).map(item => item.id as string);
      
      const updatedQuote = await quotesService.updateQuote(
        id,
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
        
        if (onCloseDialog) onCloseDialog(false);
        if (onQuoteCreated) onQuoteCreated(updatedQuote.id);
        if (onSuccess) onSuccess(updatedQuote.id);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du devis:", error);
      toast.error("Une erreur est survenue lors de la mise à jour du devis");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Prepare quote data for component
  const quoteData: Partial<Quote> = {
    contactId,
    freelancerId,
    validUntil,
    status,
    notes,
    totalAmount,
    items: items.filter(item => !item.toDelete) as QuoteItem[]
  };
  
  // Set quote data from outside
  const setQuoteData = (data: Partial<Quote>) => {
    if (data.contactId) setContactId(data.contactId);
    if (data.freelancerId) setFreelancerId(data.freelancerId);
    if (data.validUntil) setValidUntil(data.validUntil);
    if (data.status) setStatus(data.status);
    if (data.notes !== undefined) setNotes(data.notes);
    if (data.items) setItems(data.items.map(item => ({ ...item, isNew: false, toDelete: false })));
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
    addItem: handleAddItem,
    updateItem: (index: number, updatedItem: Partial<QuoteItem>) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], ...updatedItem };
      setItems(newItems);
    },
    removeItem: handleRemoveItem,
    totalAmount,
    isSubmitting,
    isQuoteSaved,
    handleSubmit,
    handleSubmitEdit,
    loadData,
    loadQuoteData,
    loading,
    contacts,
    freelancers,
    services,
    currentItem,
    setCurrentItem,
    quoteData,
    setQuoteData,
    handleAddItem,
    handleRemoveItem,
  };
};

export default useQuoteForm;
