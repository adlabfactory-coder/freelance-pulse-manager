
import { supabase } from "@/lib/supabase";
import { Quote, QuoteItem, QuoteStatus } from "@/types";
import { mapDatabaseQuoteToQuote } from "./quote-service";
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

// Fonction utilitaire pour mapper un devis de la base de données
export const mapDatabaseQuoteToQuote = (dbQuote: any): Quote => {
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
