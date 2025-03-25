
import { supabase } from '@/lib/supabase';
import { Quote, QuoteStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Utility function to ensure proper enum type
const ensureQuoteStatus = (status: string): QuoteStatus => {
  switch(status) {
    case 'draft': return QuoteStatus.DRAFT;
    case 'sent': return QuoteStatus.SENT;
    case 'accepted': return QuoteStatus.ACCEPTED;
    case 'rejected': return QuoteStatus.REJECTED;
    case 'expired': return QuoteStatus.EXPIRED;
    default: return QuoteStatus.DRAFT; // Default value
  }
};

export const fetchQuotes = async (): Promise<Quote[]> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        contact:contacts(name, email),
        freelancer:users(name, email),
        items:quote_items(*)
      `)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching quotes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load quotes. Please try again.",
      });
      return [];
    }

    // Transform and type-cast the data
    return data.map(quote => {
      // Create a properly-typed Quote object
      const typedQuote: Quote = {
        id: quote.id,
        contactId: quote.contactId,
        freelancerId: quote.freelancerId,
        totalAmount: quote.totalAmount,
        status: ensureQuoteStatus(quote.status),
        validUntil: new Date(quote.validUntil),
        notes: quote.notes || '',
        createdAt: new Date(quote.createdAt || Date.now()),
        updatedAt: new Date(quote.updatedAt || Date.now()),
        items: quote.items || [],
        // Cast partial contact/freelancer objects as needed
        contact: quote.contact as any,
        freelancer: quote.freelancer as any
      };
      
      return typedQuote;
    });
  } catch (error) {
    console.error('Unexpected error fetching quotes:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
    });
    return [];
  }
};

export const createQuote = async (quote: Quote): Promise<{ success: boolean, quoteId?: string }> => {
  try {
    // Map the Quote enum to string for database storage
    let statusString: string;
    switch(quote.status) {
      case QuoteStatus.DRAFT: statusString = 'draft'; break;
      case QuoteStatus.SENT: statusString = 'sent'; break;
      case QuoteStatus.ACCEPTED: statusString = 'accepted'; break;
      case QuoteStatus.REJECTED: statusString = 'rejected'; break;
      case QuoteStatus.EXPIRED: statusString = 'expired'; break;
      default: statusString = 'draft';
    }
    
    // Conversion de la date en format ISO string
    const validUntilStr = quote.validUntil instanceof Date 
      ? quote.validUntil.toISOString() 
      : new Date(quote.validUntil).toISOString();
    
    console.log("Création de devis avec les données:", {
      contactId: quote.contactId,
      freelancerId: quote.freelancerId,
      totalAmount: quote.totalAmount,
      status: statusString,
      validUntil: validUntilStr,
      notes: quote.notes
    });
    
    // Insérer le devis
    const { data, error } = await supabase
      .from('quotes')
      .insert({
        contactId: quote.contactId,
        freelancerId: quote.freelancerId,
        totalAmount: quote.totalAmount,
        status: statusString,
        validUntil: validUntilStr,
        notes: quote.notes
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le devis. Veuillez réessayer plus tard.",
      });
      return { success: false };
    }

    const quoteId = data.id;
    console.log("Devis créé avec ID:", quoteId);
    
    // Insérer les éléments du devis
    if (quote.items && quote.items.length > 0) {
      const quoteItemsWithQuoteId = quote.items.map(item => ({
        quoteId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        tax: item.tax || 0,
        serviceId: item.serviceId
      }));
      
      console.log("Ajout des éléments au devis:", quoteItemsWithQuoteId);
      
      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(quoteItemsWithQuoteId);
      
      if (itemsError) {
        console.error("Erreur lors de la création des éléments du devis:", itemsError);
        toast({
          variant: "destructive",
          title: "Attention",
          description: "Le devis a été créé mais certains éléments n'ont pas pu être ajoutés.",
        });
        return { success: true, quoteId };
      }
    }
    
    toast({
      title: "Succès",
      description: "Le devis a été créé avec succès.",
    });
    
    return { success: true, quoteId };
  } catch (error) {
    console.error("Erreur lors de la création du devis:", error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur est survenue lors de la création du devis.",
    });
    return { success: false };
  }
};

export const updateQuoteStatus = async (id: string, status: QuoteStatus): Promise<boolean> => {
  try {
    // Convert enum to string for database storage
    let statusString: string;
    switch(status) {
      case QuoteStatus.DRAFT: statusString = 'draft'; break;
      case QuoteStatus.SENT: statusString = 'sent'; break;
      case QuoteStatus.ACCEPTED: statusString = 'accepted'; break;
      case QuoteStatus.REJECTED: statusString = 'rejected'; break;
      case QuoteStatus.EXPIRED: statusString = 'expired'; break;
      default: statusString = 'draft';
    }
    
    const { error } = await supabase
      .from('quotes')
      .update({ status: statusString, updatedAt: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error("Erreur lors de la mise à jour du statut du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du devis.",
      });
      return false;
    }
    
    toast({
      title: "Succès",
      description: `Le statut du devis a été mis à jour en "${statusString}".`,
    });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du devis:", error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur est survenue lors de la mise à jour du statut du devis.",
    });
    return false;
  }
};
