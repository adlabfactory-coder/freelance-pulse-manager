
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
      
      return {
        id: data.id,
        contactId: data.contactId,
        freelancerId: data.freelancerId,
        totalAmount: Number(data.totalAmount),
        validUntil: new Date(data.validUntil),
        status: data.status as QuoteStatus,
        notes: data.notes,
        folder: data.folder || 'general',
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        items: data.quote_items ? data.quote_items.map((item: any) => ({
          id: item.id,
          quoteId: item.quoteId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          tax: item.tax ? Number(item.tax) : 0,
          discount: item.discount ? Number(item.discount) : 0,
          serviceId: item.serviceId
        })) : []
      };
    },
    
    // Create a new quote with its items
    createQuote: async (quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>, items: Omit<QuoteItem, 'id' | 'quoteId'>[]): Promise<Quote | null> => {
      try {
        console.log('Création du devis avec les données:', quoteData);
        console.log('Éléments du devis:', items);
        
        // Ensure the status is "draft" and handle date conversion
        const finalQuoteData = {
          contactId: quoteData.contactId,
          freelancerId: quoteData.freelancerId,
          totalAmount: quoteData.totalAmount,
          validUntil: typeof quoteData.validUntil === 'string' ? quoteData.validUntil : quoteData.validUntil.toISOString(),
          status: QuoteStatus.DRAFT, // Force status to "draft"
          notes: quoteData.notes || '',
          folder: quoteData.folder || 'general'
        };
        
        // 1. Insert the main quote using the service role to bypass RLS
        const { data: quote, error: quoteError } = await supabase.rpc('create_quote', {
          quote_data: finalQuoteData
        });
        
        if (quoteError) {
          console.error('Erreur lors de la création du devis:', quoteError);
          toast.error("Erreur lors de la création du devis: " + quoteError.message);
          return null;
        }
        
        if (!quote || !quote.id) {
          console.error('Aucun ID de devis retourné après création');
          toast.error("Erreur lors de la création du devis: aucun ID retourné");
          return null;
        }
        
        // 2. Insert quote items
        if (items.length > 0 && quote) {
          const quoteItems = items.map(item => ({
            quoteId: quote.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax || 0,
            discount: item.discount || 0,
            serviceId: item.serviceId
          }));
          
          const { error: itemsError } = await supabase.rpc('add_quote_items', {
            items_data: quoteItems
          });
          
          if (itemsError) {
            console.error('Erreur lors de l\'insertion des éléments du devis:', itemsError);
            toast.error("Certains éléments du devis n'ont pas pu être ajoutés");
          }
        }
        
        // 3. Fetch the complete quote with its items
        if (quote) {
          return await service.fetchQuoteById(quote.id);
        }
        return null;
      } catch (error) {
        console.error('Erreur inattendue lors de la création du devis:', error);
        toast.error("Une erreur inattendue s'est produite lors de la création du devis");
        return null;
      }
    },
    
    // Update an existing quote
    updateQuote: async (id: string, quoteData: Partial<Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>>, 
      items?: { 
        add?: Omit<QuoteItem, 'id' | 'quoteId'>[], 
        update?: (Partial<QuoteItem> & { id: string })[], // Fixed type here
        delete?: string[]
      }): Promise<Quote | null> => {
      
      try {
        // 1. Update the main quote
        const updates: any = {
          ...quoteData,
          updatedAt: new Date().toISOString()
        };
        
        if (quoteData.validUntil) {
          updates.validUntil = typeof quoteData.validUntil === 'string' ? quoteData.validUntil : quoteData.validUntil.toISOString();
        }
        
        const { error: quoteError } = await supabase.rpc('update_quote', {
          quote_id: id,
          quote_updates: updates
        });
        
        if (quoteError) {
          console.error(`Erreur lors de la mise à jour du devis ${id}:`, quoteError);
          toast.error("Erreur lors de la mise à jour du devis: " + quoteError.message);
          return null;
        }
        
        // 2. Handle quote items if needed
        if (items) {
          // 2.1 Add new items
          if (items.add && items.add.length > 0) {
            const newItems = items.add.map(item => ({
              quoteId: id,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              tax: item.tax || 0,
              discount: item.discount || 0,
              serviceId: item.serviceId
            }));
            
            const { error: addError } = await supabase.rpc('add_quote_items', {
              items_data: newItems
            });
            
            if (addError) {
              console.error('Erreur lors de l\'ajout d\'éléments au devis:', addError);
              toast.error("Certains éléments n'ont pas pu être ajoutés au devis");
            }
          }
          
          // 2.2 Update existing items
          if (items.update && items.update.length > 0) {
            for (const item of items.update) {
              if (item.id) {
                const { id: itemId, ...updates } = item;
                
                const { error: updateError } = await supabase.rpc('update_quote_item', {
                  item_id: itemId,
                  item_updates: updates
                });
                
                if (updateError) {
                  console.error(`Erreur lors de la mise à jour de l'élément ${itemId}:`, updateError);
                  toast.error("Certains éléments n'ont pas pu être mis à jour");
                }
              }
            }
          }
          
          // 2.3 Delete items
          if (items.delete && items.delete.length > 0) {
            const { error: deleteError } = await supabase.rpc('delete_quote_items', {
              item_ids: items.delete
            });
            
            if (deleteError) {
              console.error('Erreur lors de la suppression d\'éléments du devis:', deleteError);
              toast.error("Certains éléments n'ont pas pu être supprimés du devis");
            }
          }
        }
        
        // 3. Fetch the updated quote with its items
        return await service.fetchQuoteById(id);
      } catch (error) {
        console.error(`Erreur inattendue lors de la mise à jour du devis ${id}:`, error);
        toast.error("Une erreur inattendue s'est produite lors de la mise à jour du devis");
        return null;
      }
    },
    
    // Update quote status
    updateQuoteStatus: async (quoteId: string, status: QuoteStatus): Promise<ServiceResponse> => {
      try {
        // Get the current quote data first
        const { data: currentQuote, error: fetchError } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', quoteId)
          .single();
          
        if (fetchError) throw fetchError;
        if (!currentQuote) throw new Error('Quote not found');
        
        // Now update with all required fields
        const { error } = await supabase
          .from('quotes')
          .update({ 
            status: status,
            contactId: currentQuote.contactId,
            freelancerId: currentQuote.freelancerId,
            totalAmount: currentQuote.totalAmount,
            validUntil: currentQuote.validUntil,
            notes: currentQuote.notes,
            folder: currentQuote.folder || 'general',
            updatedAt: new Date().toISOString()
          })
          .eq('id', quoteId);
          
        if (error) throw error;
        
        return { success: true };
      } catch (error) {
        console.error('Error updating quote status:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    
    // Delete a quote (logical deletion)
    deleteQuote: async (id: string): Promise<boolean> => {
      try {
        const { error } = await supabase.rpc('delete_quote', {
          quote_id: id
        });
        
        if (error) {
          console.error(`Erreur lors de la suppression du devis ${id}:`, error);
          toast.error("Erreur lors de la suppression du devis: " + error.message);
          return false;
        }
        
        return true;
      } catch (error) {
        console.error(`Erreur inattendue lors de la suppression du devis ${id}:`, error);
        toast.error("Une erreur inattendue s'est produite lors de la suppression du devis");
        return false;
      }
    },
    
    mapDatabaseQuoteToQuote
  };
  
  return service;
};
