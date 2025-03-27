
import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase-client';

// Create a type for the context value
export interface SupabaseContextType {
  supabaseClient: typeof supabase;
}

// Create the context with a default value
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Export the provider component
export const SupabaseContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = {
    supabaseClient: supabase,
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

// Export a hook to use the context
export const useSupabaseContext = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabaseContext must be used within a SupabaseContextProvider');
  }
  return context;
};
