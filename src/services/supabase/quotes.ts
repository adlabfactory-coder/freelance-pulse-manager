
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Quote, QuoteItem, QuoteStatus } from '@/types';
import { format } from 'date-fns';

export const createQuotesService = (supabase: SupabaseClient<Database>) => {
  return {
    fetchQuotes: async (): Promise<Quote[]> => {
      try {
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select('*')
          .is('deleted_at', null);
          
        if (quotesError) throw quotesError;
        
        // Récupérer tous les éléments de devis
        const { data: itemsData, error: itemsError } = await supabase
          .from('quote_items')
          .select('*');
          
        if (itemsError) throw itemsError;
        
        // Mapper les éléments aux devis
        const quotesWithItems = quotesData.map(quote => {
          const quoteItems = itemsData.filter(item => item.quoteId === quote.id);
          
          return {
            id: quote.id,
            contactId: quote.contactId,
            freelancerId: quote.freelancerId,
            totalAmount: quote.totalAmount,
            validUntil: new Date(quote.validUntil),
            status: quote.status as QuoteStatus,
            notes: quote.notes || "",
            items: quoteItems.map(item => ({
              id: item.id,
              quoteId: item.quoteId,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount || 0,
              tax: item.tax || 0,
              serviceId: item.serviceId
            })),
            createdAt: new Date(quote.createdAt),
            updatedAt: new Date(quote.updatedAt)
          };
        });
        
        return quotesWithItems;
      } catch (error) {
        console.error('Erreur lors de la récupération des devis:', error);
        return [];
      }
    },
    
    fetchQuoteById: async (id: string): Promise<Quote | null> => {
      try {
        const { data: quote, error: quoteError } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', id)
          .is('deleted_at', null)
          .single();
          
        if (quoteError) throw quoteError;
        
        // Récupérer les éléments du devis
        const { data: items, error: itemsError } = await supabase
          .from('quote_items')
          .select('*')
          .eq('quoteId', id);
          
        if (itemsError) throw itemsError;
        
        return {
          id: quote.id,
          contactId: quote.contactId,
          freelancerId: quote.freelancerId,
          totalAmount: quote.totalAmount,
          validUntil: new Date(quote.validUntil),
          status: quote.status as QuoteStatus,
          notes: quote.notes || "",
          items: items.map(item => ({
            id: item.id,
            quoteId: item.quoteId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            tax: item.tax || 0,
            serviceId: item.serviceId
          })),
          createdAt: new Date(quote.createdAt),
          updatedAt: new Date(quote.updatedAt)
        };
      } catch (error) {
        console.error(`Erreur lors de la récupération du devis ${id}:`, error);
        return null;
      }
    },
    
    createQuote: async (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quote | null> => {
      try {
        const now = new Date();
        const quoteData = {
          contactId: quote.contactId,
          freelancerId: quote.freelancerId,
          totalAmount: quote.totalAmount,
          validUntil: format(quote.validUntil, 'yyyy-MM-dd'),
          status: quote.status,
          notes: quote.notes || "",
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        };
        
        // Insérer le devis
        const { data: newQuote, error: quoteError } = await supabase
          .from('quotes')
          .insert(quoteData)
          .select()
          .single();
          
        if (quoteError) throw quoteError;
        
        // Insérer les éléments du devis
        if (quote.items && quote.items.length > 0) {
          const quoteItems = quote.items.map(item => ({
            quoteId: newQuote.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            tax: item.tax || 0,
            serviceId: item.serviceId
          }));
          
          const { error: itemsError } = await supabase
            .from('quote_items')
            .insert(quoteItems);
            
          if (itemsError) throw itemsError;
        }
        
        return {
          id: newQuote.id,
          contactId: newQuote.contactId,
          freelancerId: newQuote.freelancerId,
          totalAmount: newQuote.totalAmount,
          validUntil: new Date(newQuote.validUntil),
          status: newQuote.status as QuoteStatus,
          notes: newQuote.notes || "",
          items: quote.items || [],
          createdAt: new Date(newQuote.createdAt),
          updatedAt: new Date(newQuote.updatedAt)
        };
      } catch (error) {
        console.error("Erreur lors de la création du devis:", error);
        return null;
      }
    },
    
    updateQuote: async (id: string, quoteData: Partial<Quote>): Promise<boolean> => {
      try {
        const updateData: any = {
          updatedAt: new Date().toISOString()
        };
        
        // Ajout des champs à mettre à jour
        if (quoteData.contactId) updateData.contactId = quoteData.contactId;
        if (quoteData.freelancerId) updateData.freelancerId = quoteData.freelancerId;
        if (quoteData.totalAmount !== undefined) updateData.totalAmount = quoteData.totalAmount;
        if (quoteData.validUntil) updateData.validUntil = format(quoteData.validUntil, 'yyyy-MM-dd');
        if (quoteData.status) updateData.status = quoteData.status;
        if (quoteData.notes !== undefined) updateData.notes = quoteData.notes || null;
        
        // Mise à jour du devis
        const { error: quoteError } = await supabase
          .from('quotes')
          .update(updateData)
          .eq('id', id);
          
        if (quoteError) throw quoteError;
        
        // Mise à jour des éléments si nécessaire
        if (quoteData.items && quoteData.items.length > 0) {
          // Supprimer les éléments existants
          const { error: deleteError } = await supabase
            .from('quote_items')
            .delete()
            .eq('quoteId', id);
            
          if (deleteError) throw deleteError;
          
          // Insérer les nouveaux éléments
          const quoteItems = quoteData.items.map(item => ({
            quoteId: id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            tax: item.tax || 0,
            serviceId: item.serviceId
          }));
          
          const { error: itemsError } = await supabase
            .from('quote_items')
            .insert(quoteItems);
            
          if (itemsError) throw itemsError;
        }
        
        return true;
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du devis ${id}:`, error);
        return false;
      }
    },
    
    updateQuoteStatus: async (id: string, status: QuoteStatus): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('quotes')
          .update({ 
            status: status,
            updatedAt: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) throw error;
        
        return true;
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du statut du devis ${id}:`, error);
        return false;
      }
    },
    
    deleteQuote: async (id: string): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('quotes')
          .update({ 
            deleted_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) throw error;
        
        return true;
      } catch (error) {
        console.error(`Erreur lors de la suppression du devis ${id}:`, error);
        return false;
      }
    }
  };
};
