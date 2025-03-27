
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

// Use the mapping function from the quotes service
export const { mapDatabaseQuoteToQuote } = quotesService;
