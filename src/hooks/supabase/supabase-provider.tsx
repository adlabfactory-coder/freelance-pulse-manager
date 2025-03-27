
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User } from '@/types/user';
import { toast } from '@/components/ui/use-toast';
import { useAuthOperations } from './use-auth-operations';
import { useUserOperations } from './use-user-operations';
import { useDatabaseStatus } from './use-database-status';

export interface SupabaseContextType {
  isLoading: boolean;
  isInitialized: boolean;
  supabaseClient: typeof supabase;
  user: User | null;
  session: any;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id'>) => Promise<{ success: boolean; id?: string }>;
  fetchUsers: () => Promise<User[]>;
  fetchUserById: (id: string) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  checkSupabaseStatus: () => Promise<{ success: boolean; message: string }>;
  checkDatabaseStatus: () => Promise<{ success: boolean; missingTables?: string[]; tables?: string[]; message?: string }>;
  initializeDatabase: () => Promise<{ success: boolean; message?: string }>;
  getMockUsers: () => User[];
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);

  const authOperations = useAuthOperations();
  const userOperations = useUserOperations();
  const dbStatus = useDatabaseStatus();

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);

        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        if (session?.user) {
          const { data: userDetails, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user details:', error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les informations de l'utilisateur.",
              variant: "destructive"
            });
          } else {
            setUser(userDetails as User);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'utilisateur:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement de l'application.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const session = await authOperations.refreshSession();
      if (session) {
        setSession(session);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    return await authOperations.signIn(email, password);
  };

  const signOut = async () => {
    await authOperations.signOut();
    setUser(null);
  };

  const value = {
    isLoading: isLoading || authOperations.isLoading || userOperations.isLoading,
    isInitialized,
    supabaseClient: supabase,
    user,
    session,
    signIn,
    signOut,
    refreshSession,
    updateUser: userOperations.updateUser,
    createUser: userOperations.createUser,
    fetchUsers: userOperations.fetchUsers,
    fetchUserById: userOperations.fetchUserById,
    deleteUser: userOperations.deleteUser,
    checkSupabaseStatus: dbStatus.checkSupabaseStatus,
    checkDatabaseStatus: dbStatus.checkDatabaseStatus,
    initializeDatabase: dbStatus.initializeDatabase,
    getMockUsers: userOperations.getMockUsers
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
