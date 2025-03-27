
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Quote, QuoteItem, QuoteStatus } from '@/types/quote';
import { toast } from 'sonner';

/**
 * Service pour la création de nouveaux devis
 */
export const createQuotesCreateService = (supabase: SupabaseClient<Database>) => {
  /**
   * Créer un nouveau devis
   */
  const createQuote = async (
    quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>,
    items: Omit<QuoteItem, 'id' | 'quoteId'>[]
  ): Promise<Quote | null> => {
    try {
      // Format date for database
      const validUntil = typeof quoteData.validUntil === 'string' 
        ? quoteData.validUntil 
        : quoteData.validUntil.toISOString();
      
      // Ensure status is a valid QuoteStatus enum value
      const status = quoteData.status as QuoteStatus;
      
      // Create quote
      const { data: quoteResult, error: quoteError } = await supabase
        .rpc('create_quote', {
          quote_data: {
            contactId: quoteData.contactId,
            freelancerId: quoteData.freelancerId,
            totalAmount: quoteData.totalAmount,
            validUntil: validUntil,
            status: status,
            notes: quoteData.notes,
            folder: quoteData.folder
          }
        });
      
      if (quoteError || !quoteResult) {
        console.error('Erreur lors de la création du devis:', quoteError);
        toast.error('Erreur lors de la création du devis');
        return null;
      }
      
      // Add items if there are any
      if (items.length > 0) {
        await addQuoteItems(supabase, quoteResult.id, items);
      }
      
      // Fetch and return the complete quote
      const { data: newQuote, error: fetchError } = await supabase
        .from('quotes')
        .select('*, quote_items(*)')
        .eq('id', quoteResult.id)
        .single();
        
      if (fetchError) {
        console.error('Erreur lors de la récupération du devis créé:', fetchError);
        // Return just the ID if we can't fetch the complete quote
        return { id: quoteResult.id } as Quote;
      }
      
      return newQuote as Quote;
    } catch (error) {
      console.error('Erreur inattendue lors de la création du devis:', error);
      toast.error('Erreur inattendue lors de la création du devis');
      return null;
    }
  };
  
  /**
   * Ajouter des éléments à un devis
   */
  const addQuoteItems = async (
    supabase: SupabaseClient<Database>,
    quoteId: string, 
    items: Omit<QuoteItem, 'id' | 'quoteId'>[]
  ): Promise<boolean> => {
    try {
      const formattedItems = items.map(item => ({
        quoteId: quoteId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        tax: item.tax || 0,
        discount: item.discount || 0,
        serviceId: item.serviceId
      }));
      
      const { error } = await supabase
        .rpc('add_quote_items', { items_data: formattedItems });
      
      if (error) {
        console.error('Erreur lors de l\'ajout des éléments au devis:', error);
        toast.error('Erreur lors de l\'ajout des éléments au devis');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur inattendue lors de l\'ajout des éléments:', error);
      return false;
    }
  };

  return {
    createQuote,
    addQuoteItems
  };
};
