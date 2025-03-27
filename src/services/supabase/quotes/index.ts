
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { createQuotesFetchService } from './quotes-fetch';
import { createQuotesCreateService } from './quotes-create';
import { createQuotesUpdateService } from './quotes-update';
import { createQuotesDeleteService } from './quotes-delete';
import { createQuotesMapperService } from './quotes-mapper';

/**
 * Service centralisé pour la gestion des devis
 */
export const createQuotesService = (supabase: SupabaseClient<Database>) => {
  // Créer chaque sous-service spécialisé
  const mapperService = createQuotesMapperService();
  const fetchService = createQuotesFetchService(supabase, mapperService);
  const createService = createQuotesCreateService(supabase);
  const updateService = createQuotesUpdateService(supabase);
  const deleteService = createQuotesDeleteService(supabase);

  // Exposer une API unifiée en combinant tous les services
  return {
    // Opérations de récupération
    fetchQuotes: fetchService.fetchQuotes,
    fetchQuoteById: fetchService.fetchQuoteById,
    
    // Opérations de création
    createQuote: createService.createQuote,
    
    // Opérations de mise à jour
    updateQuote: updateService.updateQuote,
    updateQuoteStatus: updateService.updateQuoteStatus,
    
    // Opérations de suppression
    deleteQuote: deleteService.deleteQuote
  };
};

// Réexporter pour la rétrocompatibilité
export * from './quotes-mapper';
export * from './quotes-fetch';
export * from './quotes-create';
export * from './quotes-update';
export * from './quotes-delete';
