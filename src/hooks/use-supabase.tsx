
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/components/ui/use-toast';

// Créer une fonction pour valider la configuration Supabase si elle n'existe pas déjà
const validateSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    return {
      isValid: false,
      message: 'Configuration Supabase manquante: URL ou clé anonyme non définie'
    };
  }
  
  return {
    isValid: true,
    message: 'Configuration Supabase valide'
  };
};

interface SupabaseContextType {
  supabase: SupabaseClient;
  isConnected: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Vérifier que la configuration est valide
        const config = validateSupabaseConfig();
        if (!config.isValid) {
          console.error(config.message);
          toast({
            title: "Erreur de configuration",
            description: config.message,
            variant: "destructive"
          });
          return;
        }

        // Tester la connexion à Supabase
        const { error } = await supabase.from('users').select('id').limit(1);
        
        if (error) {
          console.error('Erreur de connexion à Supabase:', error);
          toast({
            title: "Erreur de connexion",
            description: "Impossible de se connecter à Supabase",
            variant: "destructive"
          });
          setIsConnected(false);
          return;
        }
        
        setIsConnected(true);
      } catch (error) {
        console.error('Erreur lors de la vérification de la connexion:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, [toast]);

  return (
    <SupabaseContext.Provider value={{ supabase, isConnected }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase doit être utilisé à l\'intérieur d\'un SupabaseProvider');
  }
  return context;
};
