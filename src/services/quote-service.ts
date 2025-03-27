
import { supabase } from "@/lib/supabase";
import { Quote, QuoteItem, QuoteStatus } from "@/types/quote";
import { createQuotesService } from "./supabase/quotes";

// Créer une instance du service de devis avec RPCMODE activé pour contourner la RLS
const quotesService = createQuotesService(supabase);

// Exporter les fonctions du service
export const fetchQuotes = quotesService.fetchQuotes;
export const fetchQuoteById = quotesService.fetchQuoteById;
export const createQuote = quotesService.createQuote;
export const updateQuote = quotesService.updateQuote;
export const updateQuoteStatus = quotesService.updateQuoteStatus;
export const deleteQuote = quotesService.deleteQuote;

// La fonction mapDatabaseQuoteToQuote est implémentée dans le service mais 
// n'est pas exportée explicitement. Supprimons cette ligne qui cause une erreur.
// export const { mapDatabaseQuoteToQuote } = quotesService;
