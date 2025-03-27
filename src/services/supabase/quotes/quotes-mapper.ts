
import { Quote, QuoteItem, QuoteStatus } from '@/types/quote';

// Fonction utilitaire pour convertir les dates de chaîne en objet Date
const ensureDate = (dateStr: string | Date): Date => {
  if (typeof dateStr === 'string') {
    return new Date(dateStr);
  }
  return dateStr;
};

/**
 * Service de mapping pour les devis et leurs éléments
 */
export const createQuotesMapperService = () => {
  /**
   * Convertit un devis de la base de données en objet Quote
   */
  const mapDatabaseQuoteToQuote = (dbQuote: any): Quote => {
    return {
      id: dbQuote.id,
      contactId: dbQuote.contactId,
      freelancerId: dbQuote.freelancerId,
      totalAmount: dbQuote.totalAmount,
      validUntil: ensureDate(dbQuote.validUntil || new Date()),
      status: dbQuote.status as QuoteStatus,
      notes: dbQuote.notes,
      createdAt: ensureDate(dbQuote.createdAt || new Date()),
      updatedAt: ensureDate(dbQuote.updatedAt || new Date()),
      folder: dbQuote.folder || 'general',
      items: dbQuote.quote_items 
        ? dbQuote.quote_items.map((item: any) => mapDatabaseQuoteItemToQuoteItem(item)) 
        : []
    };
  };

  /**
   * Convertit un élément de devis de la base de données en objet QuoteItem
   */
  const mapDatabaseQuoteItemToQuoteItem = (dbItem: any): QuoteItem => {
    return {
      id: dbItem.id,
      quoteId: dbItem.quoteId,
      description: dbItem.description,
      quantity: dbItem.quantity,
      unitPrice: Number(dbItem.unitPrice),
      tax: dbItem.tax ? Number(dbItem.tax) : 0,
      discount: dbItem.discount ? Number(dbItem.discount) : 0,
      serviceId: dbItem.serviceId
    };
  };

  return {
    mapDatabaseQuoteToQuote,
    mapDatabaseQuoteItemToQuoteItem,
    ensureDate
  };
};
