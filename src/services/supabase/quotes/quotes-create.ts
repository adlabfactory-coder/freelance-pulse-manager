
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Quote, QuoteItem, QuoteStatus } from '@/types/quote';
import { toast } from 'sonner';

/**
 * Service pour la création de nouveaux devis
 */
export const createQuotesCreateService = (supabase: SupabaseClient<Database>) => {
  /**
   * Créer un nouveau devis
   */
  const createQuote = async (
    quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>,
    items: Omit<QuoteItem, 'id' | 'quoteId'>[]
  ): Promise<Quote | null> => {
    try {
      console.log("Création d'un devis avec les données:", quoteData);
      
      // Format date for database
      const validUntil = typeof quoteData.validUntil === 'string' 
        ? quoteData.validUntil 
        : quoteData.validUntil.toISOString();
      
      // S'assurer que le status est valide
      const status = quoteData.status || QuoteStatus.DRAFT;
      
      // Create quote
      const { data: quoteResult, error: quoteError } = await supabase
        .rpc('create_quote', {
          quote_data: {
            contactId: quoteData.contactId,
            freelancerId: quoteData.freelancerId,
            totalAmount: quoteData.totalAmount,
            validUntil: validUntil,
            status: status,
            notes: quoteData.notes || "",
            folder: quoteData.folder || "general"
          }
        });
      
      if (quoteError || !quoteResult) {
        console.error('Erreur lors de la création du devis:', quoteError);
        toast.error('Erreur lors de la création du devis');
        return null;
      }
      
      console.log("Devis créé avec ID:", quoteResult.id);
      
      // Add items if there are any
      if (items.length > 0) {
        const success = await addQuoteItems(supabase, quoteResult.id, items);
        if (!success) {
          console.warn('Problème lors de l\'ajout des éléments du devis, mais le devis a bien été créé');
        }
      }
      
      // Return the quote with ID
      return { 
        id: quoteResult.id, 
        contactId: quoteData.contactId,
        freelancerId: quoteData.freelancerId,
        totalAmount: quoteData.totalAmount,
        status: status,
        validUntil: quoteData.validUntil,
        notes: quoteData.notes,
        folder: quoteData.folder
      } as Quote;
    } catch (error) {
      console.error('Erreur inattendue lors de la création du devis:', error);
      toast.error('Erreur inattendue lors de la création du devis');
      return null;
    }
  };
  
  /**
   * Ajouter des éléments à un devis
   */
  const addQuoteItems = async (
    supabase: SupabaseClient<Database>,
    quoteId: string, 
    items: Omit<QuoteItem, 'id' | 'quoteId'>[]
  ): Promise<boolean> => {
    try {
      console.log(`Ajout de ${items.length} éléments au devis ${quoteId}`);
      
      const formattedItems = items.map(item => ({
        quoteId: quoteId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        tax: item.tax || 0,
        discount: item.discount || 0,
        serviceId: item.serviceId
      }));
      
      const { error } = await supabase
        .rpc('add_quote_items', { items_data: formattedItems });
      
      if (error) {
        console.error('Erreur lors de l\'ajout des éléments au devis:', error);
        toast.error('Erreur lors de l\'ajout des éléments au devis');
        return false;
      }
      
      console.log("Éléments de devis ajoutés avec succès");
      return true;
    } catch (error) {
      console.error('Erreur inattendue lors de l\'ajout des éléments:', error);
      return false;
    }
  };

  return {
    createQuote,
    addQuoteItems
  };
};
