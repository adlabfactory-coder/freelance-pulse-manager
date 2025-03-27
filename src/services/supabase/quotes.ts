
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { ServiceResponse } from './types';
import { Quote, QuoteItem, QuoteStatus } from '@/types/quote';
import { toast } from 'sonner';

export const createQuotesService = (supabase: SupabaseClient<Database>) => {
  // Utility function to map database quote to Quote type
  const mapDatabaseQuoteToQuote = (dbQuote: any): Quote => {
    return {
      id: dbQuote.id,
      contactId: dbQuote.contactId,
      freelancerId: dbQuote.freelancerId,
      totalAmount: dbQuote.totalAmount,
      validUntil: dbQuote.validUntil ? new Date(dbQuote.validUntil) : new Date(),
      status: dbQuote.status as QuoteStatus,
      notes: dbQuote.notes,
      createdAt: dbQuote.createdAt ? new Date(dbQuote.createdAt) : new Date(),
      updatedAt: dbQuote.updatedAt ? new Date(dbQuote.updatedAt) : new Date(),
      folder: dbQuote.folder || 'general',
      items: dbQuote.quote_items 
        ? dbQuote.quote_items.map((item: any) => ({
            id: item.id,
            quoteId: item.quoteId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            tax: item.tax ? Number(item.tax) : 0,
            discount: item.discount ? Number(item.discount) : 0,
            serviceId: item.serviceId
          })) 
        : []
    };
  };

  const service = {
    // Fetch all quotes
    fetchQuotes: async (): Promise<Quote[]> => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*, quote_items(*)')
        .is('deleted_at', null)
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des devis:', error);
        throw error;
      }
      
      // Map database data to Quote type
      return data.map(quote => ({
        id: quote.id,
        contactId: quote.contactId,
        freelancerId: quote.freelancerId,
        totalAmount: Number(quote.totalAmount),
        validUntil: new Date(quote.validUntil),
        status: quote.status as QuoteStatus,
        notes: quote.notes,
        folder: quote.folder || 'general',
        createdAt: new Date(quote.createdAt),
        updatedAt: new Date(quote.updatedAt),
        items: quote.quote_items ? quote.quote_items.map((item: any) => ({
          id: item.id,
          quoteId: item.quoteId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          tax: item.tax ? Number(item.tax) : 0,
          discount: item.discount ? Number(item.discount) : 0,
          serviceId: item.serviceId
        })) : []
      }));
    },
    
    // Fetch a quote by ID
    fetchQuoteById: async (id: string): Promise<Quote | null> => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*, quote_items(*)')
        .eq('id', id)
        .is('deleted_at', null)
        .single();
      
      if (error) {
        console.error(`Erreur lors de la récupération du devis ${id}:`, error);
        return null;
      }
      
      if (!data) return null;
      
      return mapDatabaseQuoteToQuote(data);
    },
    
    // Create a new quote
    createQuote: async (
      quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>,
      items: Omit<QuoteItem, 'id' | 'quoteId'>[]
    ): Promise<Quote | null> => {
      try {
        // Format date for database
        const validUntil = typeof quoteData.validUntil === 'string' 
          ? quoteData.validUntil 
          : quoteData.validUntil.toISOString();
        
        // Create quote
        const { data: quoteResult, error: quoteError } = await supabase
          .rpc('create_quote', {
            quote_data: {
              contactId: quoteData.contactId,
              freelancerId: quoteData.freelancerId,
              totalAmount: quoteData.totalAmount,
              validUntil: validUntil,
              status: quoteData.status,
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
          const formattedItems = items.map(item => ({
            quoteId: quoteResult.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax || 0,
            discount: item.discount || 0,
            serviceId: item.serviceId
          }));
          
          const { error: itemsError } = await supabase
            .rpc('add_quote_items', { items_data: formattedItems });
          
          if (itemsError) {
            console.error('Erreur lors de l\'ajout des éléments au devis:', itemsError);
            toast.error('Erreur lors de l\'ajout des éléments au devis');
            // Continue anyway, we have the quote created
          }
        }
        
        // Return the created quote
        return await service.fetchQuoteById(quoteResult.id);
      } catch (error) {
        console.error('Erreur inattendue lors de la création du devis:', error);
        toast.error('Erreur inattendue lors de la création du devis');
        return null;
      }
    },
    
    // Update an existing quote
    updateQuote: async (
      id: string,
      quoteData: Partial<Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>>,
      itemChanges: {
        add: Omit<QuoteItem, 'id' | 'quoteId'>[];
        update: Pick<QuoteItem, 'id'> & Partial<Omit<QuoteItem, 'id' | 'quoteId'>>[];
        delete: string[];
      }
    ): Promise<Quote | null> => {
      try {
        // Process quote data updates
        if (Object.keys(quoteData).length > 0) {
          // Format date for database if present
          const formattedData: any = { ...quoteData };
          if (formattedData.validUntil) {
            formattedData.validUntil = typeof formattedData.validUntil === 'string'
              ? formattedData.validUntil
              : formattedData.validUntil.toISOString();
          }
          
          // Update quote
          const { error: updateError } = await supabase
            .rpc('update_quote', {
              quote_id: id,
              quote_updates: formattedData
            });
          
          if (updateError) {
            console.error('Erreur lors de la mise à jour du devis:', updateError);
            toast.error('Erreur lors de la mise à jour du devis');
            return null;
          }
        }
        
        // Process item additions
        if (itemChanges.add && itemChanges.add.length > 0) {
          const formattedNewItems = itemChanges.add.map(item => ({
            quoteId: id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax || 0,
            discount: item.discount || 0,
            serviceId: item.serviceId
          }));
          
          const { error: addItemsError } = await supabase
            .rpc('add_quote_items', { items_data: formattedNewItems });
          
          if (addItemsError) {
            console.error('Erreur lors de l\'ajout des nouveaux éléments:', addItemsError);
            toast.error('Erreur lors de l\'ajout des nouveaux éléments');
            // Continue anyway
          }
        }
        
        // Process item updates
        if (itemChanges.update && itemChanges.update.length > 0) {
          for (const item of itemChanges.update) {
            if (!item.id) continue;
            
            const { error: updateItemError } = await supabase
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
            
            if (updateItemError) {
              console.error(`Erreur lors de la mise à jour de l'élément ${item.id}:`, updateItemError);
              toast.error(`Erreur lors de la mise à jour d'un élément du devis`);
              // Continue with other items
            }
          }
        }
        
        // Process item deletions
        if (itemChanges.delete && itemChanges.delete.length > 0) {
          const { error: deleteItemsError } = await supabase
            .rpc('delete_quote_items', { item_ids: itemChanges.delete });
          
          if (deleteItemsError) {
            console.error('Erreur lors de la suppression des éléments:', deleteItemsError);
            toast.error('Erreur lors de la suppression des éléments');
            // Continue anyway
          }
        }
        
        // Return updated quote
        return await service.fetchQuoteById(id);
      } catch (error) {
        console.error('Erreur inattendue lors de la mise à jour du devis:', error);
        toast.error('Erreur inattendue lors de la mise à jour du devis');
        return null;
      }
    },
    
    // Update quote status
    updateQuoteStatus: async (id: string, status: QuoteStatus): Promise<boolean> => {
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
    },
    
    // Delete a quote (soft delete)
    deleteQuote: async (id: string): Promise<boolean> => {
      try {
        const { error } = await supabase
          .rpc('delete_quote', { quote_id: id });
        
        if (error) {
          console.error('Erreur lors de la suppression du devis:', error);
          toast.error('Erreur lors de la suppression du devis');
          return false;
        }
        
        toast.success('Devis supprimé avec succès');
        return true;
      } catch (error) {
        console.error('Erreur inattendue lors de la suppression du devis:', error);
        toast.error('Erreur inattendue lors de la suppression du devis');
        return false;
      }
    }
  };
  
  return service;
};
