
import { supabase } from "@/lib/supabase";
import { createQuotesService } from "./supabase/quotes";

// Créer une instance du service de devis
const quotesService = createQuotesService(supabase);

// Exporter les fonctions du service
export const fetchQuotes = quotesService.fetchQuotes;
export const fetchQuoteById = quotesService.fetchQuoteById;
export const createQuote = quotesService.createQuote;
export const updateQuote = quotesService.updateQuote;
export const updateQuoteStatus = quotesService.updateQuoteStatus;
export const deleteQuote = quotesService.deleteQuote;
