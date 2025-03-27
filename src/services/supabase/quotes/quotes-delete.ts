
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { toast } from 'sonner';

/**
 * Service pour la suppression de devis
 */
export const createQuotesDeleteService = (supabase: SupabaseClient<Database>) => {
  /**
   * Supprimer un devis (suppression soft)
   */
  const deleteQuote = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .rpc('delete_quote', { quote_id: id });
      
      if (error) {
        console.error('Erreur lors de la suppression du devis:', error);
        toast.error('Erreur lors de la suppression du devis');
        return false;
      }
      
      toast.success('Devis supprimé avec succès');
      return true;
    } catch (error) {
      console.error('Erreur inattendue lors de la suppression du devis:', error);
      toast.error('Erreur inattendue lors de la suppression du devis');
      return false;
    }
  };

  return {
    deleteQuote
  };
};
