
import { supabase } from '@/integrations/supabase/client';
import { Quote, QuoteStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const fetchQuotes = async (): Promise<Quote[]> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .is('deleted_at', null);
    
    if (error) {
      console.error('Erreur lors de la récupération des devis:', error);
      return [];
    }
    
    return data.map(mapDatabaseQuoteToQuote);
  } catch (error) {
    console.error('Erreur lors de la récupération des devis:', error);
    return [];
  }
};

export const fetchQuoteById = async (id: string): Promise<Quote | null> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du devis ${id}:`, error);
      return null;
    }
    
    return mapDatabaseQuoteToQuote(data);
  } catch (error) {
    console.error(`Erreur lors de la récupération du devis ${id}:`, error);
    return null;
  }
};

export const createQuote = async (quoteData: Quote): Promise<{ success: boolean, id?: string }> => {
  try {
    // Map Quote to database format
    const dbQuote = {
      contactId: quoteData.contactId,
      freelancerId: quoteData.freelancerId,
      totalAmount: quoteData.totalAmount,
      status: quoteData.status,
      validUntil: quoteData.validUntil,
      notes: quoteData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Insert the quote
    const { data, error } = await supabase
      .from('quotes')
      .insert(dbQuote)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du devis:', error);
      return { success: false };
    }
    
    const quoteId = data.id;
    
    // Now insert quote items
    if (quoteData.items && quoteData.items.length > 0) {
      const itemsWithQuoteId = quoteData.items.map(item => ({
        quoteId: quoteId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        tax: item.tax,
      }));
      
      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(itemsWithQuoteId);
      
      if (itemsError) {
        console.error('Erreur lors de l\'ajout des éléments du devis:', itemsError);
        // We don't return an error here since the quote was created successfully
      }
    }
    
    return { success: true, id: quoteId };
  } catch (error) {
    console.error('Erreur lors de la création du devis:', error);
    return { success: false };
  }
};

export const updateQuoteStatus = async (id: string, status: QuoteStatus): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quotes')
      .update({ 
        status: status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la mise à jour du statut du devis ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut du devis ${id}:`, error);
    return false;
  }
};

export const deleteQuote = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quotes')
      .update({ 
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression du devis ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du devis ${id}:`, error);
    return false;
  }
};

// Helper function to map database quote to our Quote type
const mapDatabaseQuoteToQuote = (dbQuote: any): Quote => {
  return {
    id: dbQuote.id,
    contactId: dbQuote.contactId,
    freelancerId: dbQuote.freelancerId,
    totalAmount: dbQuote.totalAmount,
    validUntil: dbQuote.validUntil ? new Date(dbQuote.validUntil) : new Date(),
    status: dbQuote.status,
    notes: dbQuote.notes,
    createdAt: dbQuote.createdAt ? new Date(dbQuote.createdAt) : new Date(),
    updatedAt: dbQuote.updatedAt ? new Date(dbQuote.updatedAt) : new Date(),
    items: [] // Items are fetched separately if needed
  };
};
