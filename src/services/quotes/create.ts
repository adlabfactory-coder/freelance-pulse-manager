
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Quote, QuoteItem, QuoteStatus } from "@/types/quote";

/**
 * Créer un nouveau devis
 */
export const createQuote = async (
  quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>,
  items: Omit<QuoteItem, 'id' | 'quoteId'>[]
): Promise<Quote | null> => {
  try {
    console.log("Service de création de devis appelé avec:", quoteData);
    
    // Format date for database
    const validUntil = typeof quoteData.validUntil === 'string' 
      ? quoteData.validUntil 
      : quoteData.validUntil.toISOString();
    
    // Ensure status is a valid QuoteStatus enum value
    const status = quoteData.status || QuoteStatus.DRAFT;
    
    // Ajout de validation des données
    if (!quoteData.contactId) {
      throw new Error("L'ID du contact est requis");
    }
    
    if (!quoteData.freelancerId) {
      throw new Error("L'ID du freelancer est requis");
    }
    
    // Create quote using the RPC function
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
    
    console.log("Devis créé avec succès, ID:", quoteResult.id);
    
    // Add items if there are any
    if (items.length > 0) {
      const formattedItems = items.map(item => ({
        quoteId: quoteResult.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        tax: item.tax || 0,
        discount: item.discount || 0,
        serviceId: item.serviceId
      }));
      
      console.log("Ajout des éléments au devis:", formattedItems);
      
      const { error: itemsError } = await supabase
        .rpc('add_quote_items', { items_data: formattedItems });
      
      if (itemsError) {
        console.error('Erreur lors de l\'ajout des éléments au devis:', itemsError);
        toast.error('Erreur lors de l\'ajout des éléments au devis');
      }
    }
    
    // Return the complete quote or just the ID
    return { id: quoteResult.id } as Quote;
  } catch (error: any) {
    console.error('Erreur inattendue lors de la création du devis:', error);
    toast.error(`Erreur lors de la création du devis: ${error.message || 'Erreur inconnue'}`);
    return null;
  }
};
