
import { useContext } from 'react';
import { SupabaseContext } from '@/App';

export const useSupabase = () => {
  const supabase = useContext(SupabaseContext);
  
  if (!supabase) {
    throw new Error('useSupabase must be used within a SupabaseContext.Provider');
  }
  
  return supabase;
};
