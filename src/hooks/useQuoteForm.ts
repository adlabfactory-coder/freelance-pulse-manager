
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { createQuotesService } from "@/services/supabase/quotes";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Quote, QuoteItem, QuoteStatus } from "@/types/quote";
import { Contact } from "@/services/contacts/types";
import { Service } from "@/types/service";
import { User } from "@/types";
import { fetchServices } from "@/services/services-service";

const quotesService = createQuotesService(supabase);

const calculateTotalAmount = (items: Partial<QuoteItem>[]) => {
  return items.reduce((total, item) => {
    if (!item.quantity || !item.unitPrice) return total;
    
    let itemTotal = item.quantity * item.unitPrice;
    
    if (item.tax && item.tax > 0) {
      itemTotal += (itemTotal * item.tax) / 100;
    }
    
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
  const [contactId, setContactId] = useState<string>("");
  const [freelancerId, setFreelancerId] = useState<string>("");
  const [validUntil, setValidUntil] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [status, setStatus] = useState<QuoteStatus>(QuoteStatus.DRAFT);
  const [notes, setNotes] = useState<string>("");
  const [folder, setFolder] = useState<string>("general");
  const [items, setItems] = useState<(Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSaved, setIsQuoteSaved] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  const [currentItem, setCurrentItem] = useState<Partial<QuoteItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    tax: 20,
    discount: 0,
  });
  
  const loadData = async () => {
    setLoading(true);
    try {
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .is('deleted_at', null);
      
      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
      } else {
        setContacts(contactsData || []);
      }
      
      const { data: freelancersData, error: freelancersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'freelancer');
      
      if (freelancersError) {
        console.error('Error fetching freelancers:', freelancersError);
      } else {
        setFreelancers(freelancersData || []);
      }
      
      const servicesData = await fetchServices();
      setServices(servicesData as Service[]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error("Une erreur est survenue lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };
  
  const loadQuoteData = async (id: string) => {
    setLoading(true);
    try {
      const quote = await quotesService.fetchQuoteById(id);
      if (quote) {
        setContactId(quote.contactId);
        setFreelancerId(quote.freelancerId);
        setValidUntil(new Date(quote.validUntil));
        setStatus(quote.status as QuoteStatus);
        setNotes(quote.notes || "");
        setFolder(quote.folder || "general");
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
    
    setCurrentItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      tax: 20,
      discount: 0,
    });
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    
    if (newItems[index].id) {
      newItems[index] = { ...newItems[index], toDelete: true };
      setItems(newItems);
    } else {
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };
  
  const totalAmount = calculateTotalAmount(items.filter(item => !item.toDelete));
  
  const getQuoteData = (): Omit<Quote, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
      contactId,
      freelancerId,
      validUntil,
      status,
      notes,
      folder,
      totalAmount,
      items: items.filter(item => !item.toDelete) as QuoteItem[]
    };
  };
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    
    try {
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
  
  const handleSubmitEdit = async (id: string) => {
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Mise à jour du devis", id);
      
      const itemsToAdd = items.filter(item => item.isNew && !item.toDelete).map(({ isNew, toDelete, id, ...item }) => item as Omit<QuoteItem, 'id' | 'quoteId'>);
      const itemsToUpdate = items.filter(item => item.id && !item.isNew && !item.toDelete).map(({ isNew, toDelete, ...item }) => item as QuoteItem);
      const itemsToDelete = items.filter(item => item.toDelete && item.id).map(item => item.id as string);
      
      const updatedQuote = await quotesService.updateQuote(
        id,
        {
          contactId,
          freelancerId,
          validUntil,
          status,
          notes,
          folder,
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
  
  const quoteData: Partial<Quote> = {
    contactId,
    freelancerId,
    validUntil,
    status,
    notes,
    folder,
    totalAmount,
    items: items.filter(item => !item.toDelete) as QuoteItem[]
  };
  
  const setQuoteData = (data: Partial<Quote>) => {
    if (data.contactId) setContactId(data.contactId);
    if (data.freelancerId) setFreelancerId(data.freelancerId);
    if (data.validUntil) {
      if (data.validUntil instanceof Date) {
        setValidUntil(data.validUntil);
      } else {
        setValidUntil(new Date(data.validUntil));
      }
    }
    if (data.status) setStatus(data.status as QuoteStatus);
    if (data.notes !== undefined) setNotes(data.notes);
    if (data.folder) setFolder(data.folder);
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
    folder,
    setFolder,
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
