import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User } from '@/types/user';
import { toast } from 'sonner';
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
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id'>) => Promise<{ success: boolean; id?: string }>;
  fetchUsers: () => Promise<User[]>;
  fetchUserById: (id: string) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  checkSupabaseStatus: () => Promise<{ success: boolean; message: string }>;
  checkDatabaseStatus: () => Promise<{ success: boolean; tables: string[] }>;
  initializeDatabase: () => Promise<boolean>;
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
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de charger les informations de l'utilisateur.",
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
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement de l'application.",
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
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Email ou mot de passe incorrect.",
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
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion.",
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
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de se déconnecter.",
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
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
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
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de rafraîchir la session.",
        });
      } else {
         setSession(data.session);
      }
    } catch (error) {
      console.error("Erreur inattendue lors du rafraîchissement de la session:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rafraîchissement de la session.",
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
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la liste des utilisateurs.",
        });
        return [];
      }

      return data as User[];
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération des utilisateurs:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des utilisateurs.",
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
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les informations de l'utilisateur.",
        });
        return null;
      }

      return data as User;
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération de l'utilisateur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération de l'utilisateur.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id);

      if (error) {
        console.error('Error updating user:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour les informations de l'utilisateur.",
        });
        return false;
      }

      // Mettre à jour l'état local de l'utilisateur si c'est l'utilisateur actuel
      if (user?.id === id) {
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
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
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
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de créer l'utilisateur.",
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
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'utilisateur.",
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
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur.",
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
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur.",
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

  const checkDatabaseStatus = async (): Promise<{ success: boolean; tables: string[] }> => {
    try {
      // Replace with a more comprehensive check if needed
      return { success: true, tables: ['users'] };
    } catch (error) {
      console.error('Error checking database status:', error);
      return { success: false, tables: [] };
    }
  };

  const initializeDatabase = async (): Promise<boolean> => {
    try {
      // Add database initialization logic here if needed
      return true;
    } catch (error) {
      console.error('Error initializing database:', error);
      return false;
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
