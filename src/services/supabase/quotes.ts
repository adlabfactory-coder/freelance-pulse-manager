
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Quote, QuoteItem, QuoteStatus } from '@/types';
import { toast } from 'sonner';

export const createQuotesService = (supabase: SupabaseClient<Database>) => {
  const service = {
    // Récupérer tous les devis
    fetchQuotes: async (): Promise<Quote[]> => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*, quote_items(*)')
        .is('deleted_at', null)
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des devis:', error);
        throw error;
      }
      
      // Mapper les données de la base de données vers le type Quote
      return data.map(quote => ({
        id: quote.id,
        contactId: quote.contactId,
        freelancerId: quote.freelancerId,
        totalAmount: Number(quote.totalAmount),
        validUntil: new Date(quote.validUntil),
        status: quote.status as QuoteStatus,
        notes: quote.notes,
        createdAt: new Date(quote.createdAt),
        updatedAt: new Date(quote.updatedAt),
        items: quote.quote_items ? quote.quote_items.map((item: any) => ({
          id: item.id,
          quoteId: item.quoteId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          tax: item.tax ? Number(item.tax) : 0,
          discount: item.discount ? Number(item.discount) : 0
        })) : []
      }));
    },
    
    // Récupérer un devis par son ID
    fetchQuoteById: async (id: string): Promise<Quote | null> => {
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
      
      return {
        id: data.id,
        contactId: data.contactId,
        freelancerId: data.freelancerId,
        totalAmount: Number(data.totalAmount),
        validUntil: new Date(data.validUntil),
        status: data.status as QuoteStatus,
        notes: data.notes,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        items: data.quote_items ? data.quote_items.map((item: any) => ({
          id: item.id,
          quoteId: item.quoteId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          tax: item.tax ? Number(item.tax) : 0,
          discount: item.discount ? Number(item.discount) : 0
        })) : []
      };
    },
    
    // Créer un nouveau devis avec ses éléments
    createQuote: async (quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>, items: Omit<QuoteItem, 'id' | 'quoteId'>[]): Promise<Quote | null> => {
      try {
        console.log('Création du devis avec les données:', quoteData);
        console.log('Éléments du devis:', items);
        
        // S'assurer que le statut est "draft" (brouillon)
        const finalQuoteData = {
          ...quoteData,
          status: QuoteStatus.DRAFT // Forcer le statut à "brouillon"
        };
        
        // 1. Insérer le devis principal en utilisant le service role pour contourner la RLS
        const { data: quote, error: quoteError } = await supabase.rpc('create_quote', {
          quote_data: {
            contactId: finalQuoteData.contactId,
            freelancerId: finalQuoteData.freelancerId,
            totalAmount: finalQuoteData.totalAmount,
            validUntil: finalQuoteData.validUntil.toISOString(),
            status: finalQuoteData.status,
            notes: finalQuoteData.notes || ''
          }
        });
        
        if (quoteError) {
          console.error('Erreur lors de la création du devis:', quoteError);
          toast.error("Erreur lors de la création du devis: " + quoteError.message);
          return null;
        }
        
        if (!quote || !quote.id) {
          console.error('Aucun ID de devis retourné après création');
          toast.error("Erreur lors de la création du devis: aucun ID retourné");
          return null;
        }
        
        // 2. Insérer les éléments du devis
        if (items.length > 0 && quote) {
          const quoteItems = items.map(item => ({
            quoteId: quote.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax || 0,
            discount: item.discount || 0
          }));
          
          const { error: itemsError } = await supabase.rpc('add_quote_items', {
            items_data: quoteItems
          });
          
          if (itemsError) {
            console.error('Erreur lors de l\'insertion des éléments du devis:', itemsError);
            toast.error("Certains éléments du devis n'ont pas pu être ajoutés");
          }
        }
        
        // 3. Récupérer le devis complet avec ses éléments
        if (quote) {
          return await service.fetchQuoteById(quote.id);
        }
        return null;
      } catch (error) {
        console.error('Erreur inattendue lors de la création du devis:', error);
        toast.error("Une erreur inattendue s'est produite lors de la création du devis");
        return null;
      }
    },
    
    // Mettre à jour un devis existant
    updateQuote: async (id: string, quoteData: Partial<Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>>, 
      items?: { 
        add?: Omit<QuoteItem, 'id' | 'quoteId'>[], 
        update?: (Pick<QuoteItem, 'id'> & Partial<Omit<QuoteItem, 'id' | 'quoteId'>>)[],
        delete?: string[]
      }): Promise<Quote | null> => {
      
      try {
        // 1. Mettre à jour le devis principal
        const updates: any = {
          ...quoteData,
          updatedAt: new Date().toISOString()
        };
        
        if (quoteData.validUntil) {
          updates.validUntil = quoteData.validUntil.toISOString();
        }
        
        const { error: quoteError } = await supabase.rpc('update_quote', {
          quote_id: id,
          quote_updates: updates
        });
        
        if (quoteError) {
          console.error(`Erreur lors de la mise à jour du devis ${id}:`, quoteError);
          toast.error("Erreur lors de la mise à jour du devis: " + quoteError.message);
          return null;
        }
        
        // 2. Gérer les éléments du devis si nécessaire
        if (items) {
          // 2.1 Ajouter de nouveaux éléments
          if (items.add && items.add.length > 0) {
            const newItems = items.add.map(item => ({
              quoteId: id,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              tax: item.tax || 0,
              discount: item.discount || 0
            }));
            
            const { error: addError } = await supabase.rpc('add_quote_items', {
              items_data: newItems
            });
            
            if (addError) {
              console.error('Erreur lors de l\'ajout d\'éléments au devis:', addError);
              toast.error("Certains éléments n'ont pas pu être ajoutés au devis");
            }
          }
          
          // 2.2 Mettre à jour des éléments existants
          if (items.update && items.update.length > 0) {
            for (const item of items.update) {
              if (item.id) {
                const { id: itemId, ...updates } = item;
                
                const { error: updateError } = await supabase.rpc('update_quote_item', {
                  item_id: itemId,
                  item_updates: updates
                });
                
                if (updateError) {
                  console.error(`Erreur lors de la mise à jour de l'élément ${itemId}:`, updateError);
                  toast.error("Certains éléments n'ont pas pu être mis à jour");
                }
              }
            }
          }
          
          // 2.3 Supprimer des éléments
          if (items.delete && items.delete.length > 0) {
            const { error: deleteError } = await supabase.rpc('delete_quote_items', {
              item_ids: items.delete
            });
            
            if (deleteError) {
              console.error('Erreur lors de la suppression d\'éléments du devis:', deleteError);
              toast.error("Certains éléments n'ont pas pu être supprimés du devis");
            }
          }
        }
        
        // 3. Récupérer le devis mis à jour avec ses éléments
        return await service.fetchQuoteById(id);
      } catch (error) {
        console.error(`Erreur inattendue lors de la mise à jour du devis ${id}:`, error);
        toast.error("Une erreur inattendue s'est produite lors de la mise à jour du devis");
        return null;
      }
    },
    
    // Mettre à jour le statut d'un devis
    updateQuoteStatus: async (id: string, status: QuoteStatus): Promise<boolean> => {
      try {
        const { error } = await supabase.rpc('update_quote_status', {
          quote_id: id,
          new_status: status
        });
        
        if (error) {
          console.error(`Erreur lors de la mise à jour du statut du devis ${id}:`, error);
          toast.error("Erreur lors de la mise à jour du statut du devis: " + error.message);
          return false;
        }
        
        return true;
      } catch (error) {
        console.error(`Erreur inattendue lors de la mise à jour du statut du devis ${id}:`, error);
        toast.error("Une erreur inattendue s'est produite lors de la mise à jour du statut du devis");
        return false;
      }
    },
    
    // Supprimer un devis (suppression logique)
    deleteQuote: async (id: string): Promise<boolean> => {
      try {
        const { error } = await supabase.rpc('delete_quote', {
          quote_id: id
        });
        
        if (error) {
          console.error(`Erreur lors de la suppression du devis ${id}:`, error);
          toast.error("Erreur lors de la suppression du devis: " + error.message);
          return false;
        }
        
        return true;
      } catch (error) {
        console.error(`Erreur inattendue lors de la suppression du devis ${id}:`, error);
        toast.error("Une erreur inattendue s'est produite lors de la suppression du devis");
        return false;
      }
    }
  };
  
  return service;
};
