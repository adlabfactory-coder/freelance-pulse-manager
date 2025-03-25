
import { supabase } from "@/lib/supabase-client";
import { Quote, QuoteItem, QuoteStatus } from "@/types";
import { toast } from "@/components/ui/use-toast";

export const fetchQuotes = async (): Promise<Quote[]> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        contact:contactId (name, email),
        freelancer:freelancerId (name, email)
      `)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les devis. Veuillez réessayer plus tard.",
      });
      return [];
    }

    const quotes = data || [];
    
    // Récupérer les éléments du devis pour chaque devis
    const quotesWithItems = await Promise.all(
      quotes.map(async (quote) => {
        const { data: items, error: itemsError } = await supabase
          .from('quote_items')
          .select('*')
          .eq('quoteId', quote.id);
        
        if (itemsError) {
          console.error("Erreur lors de la récupération des éléments du devis:", itemsError);
          return { ...quote, items: [] };
        }
        
        return { 
          ...quote, 
          items: items || [],
          contact: quote.contact,
          freelancer: quote.freelancer,
          validUntil: new Date(quote.validUntil),
          createdAt: quote.createdAt ? new Date(quote.createdAt) : undefined,
          updatedAt: quote.updatedAt ? new Date(quote.updatedAt) : undefined
        };
      })
    );

    return quotesWithItems;
  } catch (error) {
    console.error("Erreur lors de la récupération des devis:", error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur est survenue lors de la récupération des devis.",
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
