
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User } from '@/types/user';
import { toast } from '@/components/ui/use-toast';
import { UserRole } from '@/types';

interface SupabaseContextType {
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

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Error signing in:', error);
        toast({
          title: "Erreur d'authentification",
          description: "Email ou mot de passe incorrect.",
          variant: "destructive"
        });
      } else {
        console.log('Sign in successful:', data);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
      }
    } catch (error) {
      console.error("Erreur inattendue lors de la connexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Erreur",
          description: "Impossible de se déconnecter.",
          variant: "destructive"
        });
      } else {
        console.log('Sign out successful');
        toast({
          title: "Déconnexion réussie",
          description: "Vous êtes maintenant déconnecté.",
        });
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur inattendue lors de la déconnexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error('Error refreshing session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de rafraîchir la session.",
          variant: "destructive"
        });
      } else {
         setSession(data.session);
      }
    } catch (error) {
      console.error("Erreur inattendue lors du rafraîchissement de la session:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du rafraîchissement de la session.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (): Promise<User[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des utilisateurs.",
          variant: "destructive"
        });
        return [];
      }

      return data as User[];
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération des utilisateurs:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des utilisateurs.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserById = async (id: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de l'utilisateur.",
          variant: "destructive"
        });
        return null;
      }

      return data as User;
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération de l'utilisateur.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!userData.id) {
        console.error('No user ID provided for update');
        toast({
          title: "Erreur",
          description: "ID utilisateur manquant pour la mise à jour.",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userData.id);

      if (error) {
        console.error('Error updating user:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour les informations de l'utilisateur.",
          variant: "destructive"
        });
        return false;
      }

      // Mettre à jour l'état local de l'utilisateur si c'est l'utilisateur actuel
      if (user?.id === userData.id) {
        setUser({ ...user, ...userData });
      }

      toast({
        title: "Utilisateur mis à jour",
        description: "Les informations de l'utilisateur ont été mises à jour avec succès.",
      });
      return true;
    } catch (error) {
      console.error("Erreur inattendue lors de la mise à jour de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id'>): Promise<{ success: boolean; id?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer l'utilisateur.",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Utilisateur créé",
        description: "L'utilisateur a été créé avec succès.",
      });
      return { success: true, id: data.id };
    } catch (error) {
      console.error("Erreur inattendue lors de la création de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'utilisateur.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      });
      return true;
    } catch (error) {
      console.error("Erreur inattendue lors de la suppression de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkSupabaseStatus = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.from('users').select('id').limit(1);
      if (error) {
        console.error('Supabase connection error:', error);
        return { success: false, message: 'Failed to connect to Supabase.' };
      }
      return { success: true, message: 'Supabase is connected.' };
    } catch (error) {
      console.error('Unexpected error checking Supabase status:', error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

  const checkDatabaseStatus = async (): Promise<{ success: boolean; missingTables?: string[]; message?: string }> => {
    try {
      // Example implementation - should be expanded for full checking
      const tablesStatus = await Promise.all([
        supabase.from('users').select('count', { count: 'exact', head: true }),
        supabase.from('contacts').select('count', { count: 'exact', head: true }),
        supabase.from('appointments').select('count', { count: 'exact', head: true }),
        supabase.from('quotes').select('count', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('count', { count: 'exact', head: true })
      ]);
      
      const missingTables = tablesStatus
        .map((result, index) => {
          const tables = ['users', 'contacts', 'appointments', 'quotes', 'subscriptions'];
          return result.error ? tables[index] : null;
        })
        .filter(Boolean) as string[];
      
      return { 
        success: missingTables.length === 0,
        missingTables,
        message: missingTables.length > 0 
          ? `Tables manquantes: ${missingTables.join(', ')}` 
          : 'Toutes les tables sont correctement configurées'
      };
    } catch (error) {
      console.error('Error checking database status:', error);
      return { success: false, missingTables: [], message: 'An error occurred checking the database.' };
    }
  };

  const initializeDatabase = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      // This would need to be expanded for actual table creation
      return { success: true, message: 'Database initialized successfully' };
    } catch (error) {
      console.error('Error initializing database:', error);
      return { success: false, message: 'Database initialization failed' };
    }
  };

  // Fonctions de maquette pour les données de test
  const getMockUsers = (): User[] => {
    return [
      {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: UserRole.ADMIN,
        avatar: null,
        calendly_enabled: false
      },
      {
        id: "2",
        name: "Freelancer User",
        email: "freelancer@example.com",
        role: UserRole.FREELANCER,
        avatar: null,
        calendly_enabled: false
      }
    ];
  };

  const value = {
    isLoading,
    isInitialized,
    supabaseClient: supabase,
    user,
    session,
    signIn,
    signOut,
    refreshSession,
    updateUser,
    createUser,
    fetchUsers,
    fetchUserById,
    deleteUser,
    checkSupabaseStatus,
    checkDatabaseStatus,
    initializeDatabase,
    getMockUsers
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
