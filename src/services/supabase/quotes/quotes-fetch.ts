
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Quote } from '@/types/quote';
import { createQuotesMapperService } from './quotes-mapper';

/**
 * Service de récupération des devis
 */
export const createQuotesFetchService = (
  supabase: SupabaseClient<Database>,
  mapperService?: ReturnType<typeof createQuotesMapperService>
) => {
  // Créer le service de mapping si non fourni
  const mapper = mapperService || createQuotesMapperService();

  /**
   * Récupérer tous les devis
   */
  const fetchQuotes = async (): Promise<Quote[]> => {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, quote_items(*)')
      .is('deleted_at', null)
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des devis:', error);
      throw error;
    }
    
    // Conversion des données avec le mapper
    return data.map(quote => mapper.mapDatabaseQuoteToQuote(quote));
  };
  
  /**
   * Récupérer un devis par ID
   */
  const fetchQuoteById = async (id: string): Promise<Quote | null> => {
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
    
    return mapper.mapDatabaseQuoteToQuote(data);
  };

  return {
    fetchQuotes,
    fetchQuoteById
  };
};
