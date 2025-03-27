
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { checkSupabaseConnection } from '@/lib/supabase-client';
import { checkDatabaseStatus, initializeDatabase } from '@/services/supabase-database-service';

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
  supabaseClient: SupabaseClient; // Alias for compatibility
  isConnected: boolean;
  // Database-related methods
  checkSupabaseStatus: () => Promise<{ success: boolean; message?: string }>;
  checkDatabaseStatus: () => Promise<{ success: boolean; missingTables?: string[]; message?: string }>;
  initializeDatabase: (options?: any) => Promise<{ success: boolean; message: string; details?: any[] }>;
  // User-related methods
  fetchUsers: () => Promise<User[]>;
  fetchUserById: (id: string) => Promise<User | null>;
  updateUser: (user: Partial<User> & { id: string }) => Promise<{ success: boolean; error?: string }>;
  createUser: (user: Partial<User>) => Promise<{ success: boolean; error?: string; userId?: string }>;
  deleteUser: (id: string) => Promise<{ success: boolean; error?: string }>;
  // Mock data for development
  getMockUsers: () => User[];
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);

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
  }, []);

  // Database services
  const checkSupabaseStatusImpl = async () => {
    try {
      const isConnected = await checkSupabaseConnection();
      return { 
        success: isConnected, 
        message: isConnected ? 'Connexion établie' : 'Échec de la connexion à Supabase' 
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Erreur de connexion' };
    }
  };

  const checkDatabaseStatusImpl = async () => {
    return await checkDatabaseStatus();
  };

  const initializeDatabaseImpl = async (options?: any) => {
    return await initializeDatabase(options);
  };

  // Mock data services
  const getMockUsersImpl = (): User[] => {
    return [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      },
      {
        id: '2',
        name: 'Freelancer User',
        email: 'freelancer@example.com',
        role: 'freelancer'
      }
    ];
  };

  // User services
  const fetchUsersImpl = async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  };

  const fetchUserByIdImpl = async (id: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      return null;
    }
  };

  const updateUserImpl = async (user: Partial<User> & { id: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.from('users').update(user).eq('id', user.id);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const createUserImpl = async (user: Partial<User>): Promise<{ success: boolean; error?: string; userId?: string }> => {
    try {
      const { data, error } = await supabase.from('users').insert(user).select();
      if (error) throw error;
      return { success: true, userId: data?.[0]?.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteUserImpl = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const supabaseContext: SupabaseContextType = {
    supabase,
    supabaseClient: supabase, // Alias for compatibility
    isConnected,
    // Database methods
    checkSupabaseStatus: checkSupabaseStatusImpl,
    checkDatabaseStatus: checkDatabaseStatusImpl,
    initializeDatabase: initializeDatabaseImpl,
    // User methods
    fetchUsers: fetchUsersImpl,
    fetchUserById: fetchUserByIdImpl,
    updateUser: updateUserImpl,
    createUser: createUserImpl,
    deleteUser: deleteUserImpl,
    // Mock data methods
    getMockUsers: getMockUsersImpl
  };

  return (
    <SupabaseContext.Provider value={supabaseContext}>
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
