
import { useContext } from 'react';
import { SupabaseContext } from '@/App';
import { toast } from '@/components/ui/use-toast';

export const useSupabase = () => {
  const supabase = useContext(SupabaseContext);
  
  if (!supabase) {
    const errorMessage = 'useSupabase doit être utilisé à l\'intérieur d\'un SupabaseContext.Provider';
    toast({
      variant: "destructive",
      title: "Erreur de configuration",
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
  
  return supabase;
};
