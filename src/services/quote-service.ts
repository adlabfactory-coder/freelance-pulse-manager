
import { supabase } from "@/integrations/supabase/client";
import { Quote, QuoteItem, QuoteStatus } from "@/types";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

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

export const createQuote = async (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quote | null> => {
  try {
    const now = new Date();
    const quoteWithDates = {
      ...quote,
      validUntil: format(quote.validUntil, 'yyyy-MM-dd'),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    const { data, error } = await supabase
      .from('quotes')
      .insert(quoteWithDates)
      .select()
      .single();

    if (error) {
      console.error("Error creating quote:", error);
      return null;
    }

    return {
      id: data.id,
      contactId: data.contactId,
      freelancerId: data.freelancerId,
      totalAmount: data.totalAmount,
      validUntil: new Date(data.validUntil),
      status: data.status as QuoteStatus,
      notes: data.notes || "",
      items: [],
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  } catch (error) {
    console.error("Error creating quote:", error);
    return null;
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
