import { supabase } from '@/lib/supabase';
import { Quote, QuoteStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Utility function to ensure proper enum type
const ensureQuoteStatus = (status: string): QuoteStatus => {
  const validStatuses: QuoteStatus[] = ['draft', 'sent', 'accepted', 'rejected', 'expired'];
  return validStatuses.includes(status as QuoteStatus) 
    ? (status as QuoteStatus) 
    : 'draft';
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
    return data.map(quote => ({
      id: quote.id,
      contactId: quote.contactId,
      freelancerId: quote.freelancerId,
      totalAmount: quote.totalAmount,
      status: ensureQuoteStatus(quote.status), // Ensure proper enum type
      validUntil: new Date(quote.validUntil),
      notes: quote.notes || '',
      createdAt: new Date(quote.createdAt || Date.now()),
      updatedAt: new Date(quote.updatedAt || Date.now()),
      items: quote.items || [],
      contact: quote.contact,
      freelancer: quote.freelancer
    }));
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
    // Insérer le devis
    const { data, error } = await supabase
      .from('quotes')
      .insert({
        contactId: quote.contactId,
        freelancerId: quote.freelancerId,
        totalAmount: quote.totalAmount,
        status: quote.status,
        validUntil: quote.validUntil.toISOString(),
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
    
    // Insérer les éléments du devis
    if (quote.items && quote.items.length > 0) {
      const quoteItemsWithQuoteId = quote.items.map(item => ({
        ...item,
        quoteId
      }));
      
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
    const { error } = await supabase
      .from('quotes')
      .update({ status, updatedAt: new Date().toISOString() })
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
      description: `Le statut du devis a été mis à jour en "${status}".`,
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
