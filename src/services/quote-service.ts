
import { supabase } from "@/lib/supabase";
import { Quote, QuoteItem, QuoteStatus } from "@/types";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
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

// Fonction utilitaire pour mapper un devis de la base de données
export const mapDatabaseQuoteToQuote = (dbQuote: any): Quote => {
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
