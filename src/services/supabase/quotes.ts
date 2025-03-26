
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Quote, QuoteItem, QuoteStatus } from '@/types';
import { toast } from 'sonner';

export const createQuotesService = (supabase: SupabaseClient<Database>) => {
  return {
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
        
        // 1. Insérer le devis principal
        const { data: quote, error: quoteError } = await supabase
          .from('quotes')
          .insert({
            contactId: quoteData.contactId,
            freelancerId: quoteData.freelancerId,
            totalAmount: quoteData.totalAmount,
            validUntil: quoteData.validUntil.toISOString(),
            status: quoteData.status,
            notes: quoteData.notes
          })
          .select()
          .single();
        
        if (quoteError) {
          console.error('Erreur lors de la création du devis:', quoteError);
          toast.error("Erreur lors de la création du devis: " + quoteError.message);
          return null;
        }
        
        // 2. Insérer les éléments du devis
        if (items.length > 0) {
          const quoteItems = items.map(item => ({
            quoteId: quote.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax || 0,
            discount: item.discount || 0
          }));
          
          const { error: itemsError } = await supabase
            .from('quote_items')
            .insert(quoteItems);
          
          if (itemsError) {
            console.error('Erreur lors de l\'insertion des éléments du devis:', itemsError);
            // Ne pas échouer complètement, mais informer l'utilisateur
            toast.error("Certains éléments du devis n'ont pas pu être ajoutés");
          }
        }
        
        // 3. Récupérer le devis complet avec ses éléments
        return await this.fetchQuoteById(quote.id);
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
        update?: Pick<QuoteItem, 'id'> & Partial<Omit<QuoteItem, 'id' | 'quoteId'>>[],
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
        
        const { error: quoteError } = await supabase
          .from('quotes')
          .update(updates)
          .eq('id', id);
        
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
            
            const { error: addError } = await supabase
              .from('quote_items')
              .insert(newItems);
            
            if (addError) {
              console.error('Erreur lors de l\'ajout d\'éléments au devis:', addError);
              toast.error("Certains éléments n'ont pas pu être ajoutés au devis");
            }
          }
          
          // 2.2 Mettre à jour des éléments existants
          if (items.update && items.update.length > 0) {
            for (const item of items.update) {
              const { id: itemId, ...updates } = item;
              
              const { error: updateError } = await supabase
                .from('quote_items')
                .update(updates)
                .eq('id', itemId);
              
              if (updateError) {
                console.error(`Erreur lors de la mise à jour de l'élément ${itemId}:`, updateError);
                toast.error("Certains éléments n'ont pas pu être mis à jour");
              }
            }
          }
          
          // 2.3 Supprimer des éléments
          if (items.delete && items.delete.length > 0) {
            const { error: deleteError } = await supabase
              .from('quote_items')
              .delete()
              .in('id', items.delete);
            
            if (deleteError) {
              console.error('Erreur lors de la suppression d\'éléments du devis:', deleteError);
              toast.error("Certains éléments n'ont pas pu être supprimés du devis");
            }
          }
        }
        
        // 3. Récupérer le devis mis à jour avec ses éléments
        return await this.fetchQuoteById(id);
      } catch (error) {
        console.error(`Erreur inattendue lors de la mise à jour du devis ${id}:`, error);
        toast.error("Une erreur inattendue s'est produite lors de la mise à jour du devis");
        return null;
      }
    },
    
    // Mettre à jour le statut d'un devis
    updateQuoteStatus: async (id: string, status: QuoteStatus): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('quotes')
          .update({
            status,
            updatedAt: new Date().toISOString()
          })
          .eq('id', id);
        
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
        const { error } = await supabase
          .from('quotes')
          .update({
            deleted_at: new Date().toISOString()
          })
          .eq('id', id);
        
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
};
