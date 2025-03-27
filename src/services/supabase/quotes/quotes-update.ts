
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Quote, QuoteItem, QuoteStatus } from '@/types/quote';
import { toast } from 'sonner';

/**
 * Service pour la mise à jour des devis
 */
export const createQuotesUpdateService = (supabase: SupabaseClient<Database>) => {
  /**
   * Mettre à jour un devis existant avec ses éléments
   */
  const updateQuote = async (
    id: string,
    quoteData: Partial<Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>>,
    itemChanges: {
      add: Omit<QuoteItem, 'id' | 'quoteId'>[];
      update: (Pick<QuoteItem, 'id'> & Partial<Omit<QuoteItem, 'id' | 'quoteId'>>)[];
      delete: string[];
    }
  ): Promise<Quote | null> => {
    try {
      // Traitement des mises à jour des données du devis
      if (Object.keys(quoteData).length > 0) {
        await updateQuoteData(supabase, id, quoteData);
      }
      
      // Process item additions
      if (itemChanges.add && itemChanges.add.length > 0) {
        await addQuoteItems(supabase, id, itemChanges.add);
      }
      
      // Process item updates
      if (itemChanges.update && itemChanges.update.length > 0) {
        await updateQuoteItems(supabase, itemChanges.update);
      }
      
      // Process item deletions
      if (itemChanges.delete && itemChanges.delete.length > 0) {
        await deleteQuoteItems(supabase, itemChanges.delete);
      }
      
      // Return updated quote
      const { data: updatedQuote, error: fetchError } = await supabase
        .from('quotes')
        .select('*, quote_items(*)')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        console.error('Erreur lors de la récupération du devis mis à jour:', fetchError);
        // Return just the ID if we can't fetch the complete quote
        return { id } as Quote;
      }
      
      return updatedQuote as Quote;
    } catch (error) {
      console.error('Erreur inattendue lors de la mise à jour du devis:', error);
      toast.error('Erreur inattendue lors de la mise à jour du devis');
      return null;
    }
  };
  
  /**
   * Mettre à jour les données principales d'un devis
   */
  const updateQuoteData = async (
    supabase: SupabaseClient<Database>,
    quoteId: string, 
    quoteUpdates: Partial<Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<boolean> => {
    try {
      // Format date for database if present
      const formattedData: any = { ...quoteUpdates };
      if (formattedData.validUntil) {
        formattedData.validUntil = typeof formattedData.validUntil === 'string'
          ? formattedData.validUntil
          : formattedData.validUntil.toISOString();
      }
      
      // Update quote
      const { error } = await supabase
        .rpc('update_quote', {
          quote_id: quoteId,
          quote_updates: formattedData
        });
      
      if (error) {
        console.error('Erreur lors de la mise à jour du devis:', error);
        toast.error('Erreur lors de la mise à jour du devis');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur inattendue lors de la mise à jour du devis:', error);
      return false;
    }
  };
  
  /**
   * Ajouter de nouveaux éléments à un devis
   */
  const addQuoteItems = async (
    supabase: SupabaseClient<Database>,
    quoteId: string, 
    items: Omit<QuoteItem, 'id' | 'quoteId'>[]
  ): Promise<boolean> => {
    try {
      const formattedNewItems = items.map(item => ({
        quoteId: quoteId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        tax: item.tax || 0,
        discount: item.discount || 0,
        serviceId: item.serviceId
      }));
      
      const { error } = await supabase
        .rpc('add_quote_items', { items_data: formattedNewItems });
      
      if (error) {
        console.error('Erreur lors de l\'ajout des nouveaux éléments:', error);
        toast.error('Erreur lors de l\'ajout des nouveaux éléments');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur inattendue lors de l\'ajout des éléments:', error);
      return false;
    }
  };
  
  /**
   * Mettre à jour des éléments existants d'un devis
   */
  const updateQuoteItems = async (
    supabase: SupabaseClient<Database>,
    items: (Pick<QuoteItem, 'id'> & Partial<Omit<QuoteItem, 'id' | 'quoteId'>>)[]
  ): Promise<boolean> => {
    try {
      for (const item of items) {
        if (!item.id) continue;
        
        const { error } = await supabase
          .rpc('update_quote_item', {
            item_id: item.id,
            item_updates: {
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              tax: item.tax,
              discount: item.discount
            }
          });
        
        if (error) {
          console.error(`Erreur lors de la mise à jour de l'élément ${item.id}:`, error);
          toast.error(`Erreur lors de la mise à jour d'un élément du devis`);
          // Continue with other items
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erreur inattendue lors de la mise à jour des éléments:', error);
      return false;
    }
  };
  
  /**
   * Supprimer des éléments d'un devis
   */
  const deleteQuoteItems = async (
    supabase: SupabaseClient<Database>,
    itemIds: string[]
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .rpc('delete_quote_items', { item_ids: itemIds });
      
      if (error) {
        console.error('Erreur lors de la suppression des éléments:', error);
        toast.error('Erreur lors de la suppression des éléments');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur inattendue lors de la suppression des éléments:', error);
      return false;
    }
  };
  
  /**
   * Mettre à jour le statut d'un devis
   */
  const updateQuoteStatus = async (id: string, status: QuoteStatus): Promise<boolean> => {
    try {
      const { error } = await supabase
        .rpc('update_quote_status', {
          quote_id: id,
          new_status: status
        });
      
      if (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        toast.error('Erreur lors de la mise à jour du statut');
        return false;
      }
      
      toast.success('Statut du devis mis à jour');
      return true;
    } catch (error) {
      console.error('Erreur inattendue lors de la mise à jour du statut:', error);
      toast.error('Erreur inattendue lors de la mise à jour du statut');
      return false;
    }
  };

  return {
    updateQuote,
    updateQuoteStatus,
    updateQuoteData,
    addQuoteItems,
    updateQuoteItems,
    deleteQuoteItems
  };
};
