
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase-client";
import { User, UserRole } from "@/types";
import { getMockUsers } from "@/utils/supabase-mock-data";
import { AuthContextType } from "@/types/auth";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,
  isAdmin: false,
  isFreelancer: false,
  isSuperAdmin: false,
  isAccountManager: false,
  isAdminOrSuperAdmin: false,
  error: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const DEMO_MODE = true;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (DEMO_MODE) {
          const mockUsers = getMockUsers();
          const defaultUser = mockUsers[0];
          
          console.log("Mode démonstration activé, utilisation d'un utilisateur par défaut:", defaultUser.email);
          setUser(defaultUser);
          setIsLoading(false);
          
          try {
            const { data, error } = await supabase.from('contacts').select('id').limit(1);
            if (error) {
              console.warn("La connexion à Supabase semble avoir un problème:", error.message);
            } else {
              console.log("Connexion à Supabase réussie, contacts accessibles");
            }
          } catch (err) {
            console.warn("Erreur lors du test de connexion à Supabase:", err);
          }
          
          return;
        }
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log("Auth state changed:", event, newSession?.user?.email);
            setSession(newSession);
            setUser(newSession?.user ? mapSupabaseUser(newSession.user) : null);
            setIsLoading(false);
            
            if (newSession?.user && event === 'SIGNED_IN') {
              setTimeout(() => {
                console.log("Session utilisateur mise à jour");
              }, 0);
            }
          }
        );

        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          console.log("Session existante trouvée:", existingSession.user.email);
          setSession(existingSession);
          setUser(mapSupabaseUser(existingSession.user));
        } else {
          console.log("Aucune session existante trouvée");
          setUser(null);
          setSession(null);
        }
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Erreur lors de la vérification de l'authentification:", err);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const mapSupabaseUser = (supabaseUser: any): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
      role: (supabaseUser.user_metadata?.role || 'admin') as UserRole,
      avatar: supabaseUser.user_metadata?.avatar || null
    };
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      if (DEMO_MODE) {
        console.log("Tentative de connexion en mode démo avec:", email);
        
        const mockUsers = getMockUsers();
        const mockUser = mockUsers.find(u => u.email === email);
        
        if (mockUser) {
          console.log("Utilisateur de démonstration trouvé:", mockUser.name);
          setUser(mockUser);
          toast.success(`Connecté en tant que ${mockUser.name}`);
          return { success: true };
        }
        
        console.log("Email non reconnu, utilisation de l'admin par défaut");
        const defaultAdmin = mockUsers.find(u => u.role === UserRole.ADMIN) || mockUsers[0];
        setUser(defaultAdmin);
        toast.success(`Connecté en tant que ${defaultAdmin.name}`);
        
        return { success: true };
      }
      
      console.log("Tentative de connexion à Supabase avec:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Erreur de connexion Supabase:", error.message);
        toast.error(`Erreur de connexion: ${error.message}`);
        return { success: false, error: error.message };
      }
      
      console.log("Connexion Supabase réussie:", data.user?.email);
      toast.success(`Connecté en tant que ${data.user?.email}`);
      
      return { success: true };
    } catch (err: any) {
      console.error("Erreur lors de la connexion:", err.message);
      toast.error(`Erreur lors de la connexion: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      if (DEMO_MODE) {
        console.log("Inscription simulée pour:", email, name, role);
        
        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          name,
          role,
          avatar: null
        };
        
        setUser(newUser);
        toast.success("Compte créé avec succès");
        
        return { success: true };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        console.error("Erreur d'inscription Supabase:", error.message);
        toast.error(`Erreur lors de l'inscription: ${error.message}`);
        return { success: false, error: error.message };
      }
      
      toast.success("Compte créé avec succès. Vérifiez votre email pour confirmer l'inscription.");
      return { success: true };
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err.message);
      toast.error(`Erreur lors de l'inscription: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      if (DEMO_MODE) {
        setUser(null);
        navigate('/auth/login');
        toast.success("Déconnexion réussie");
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erreur lors de la déconnexion Supabase:", error.message);
        toast.error(`Erreur lors de la déconnexion: ${error.message}`);
        return;
      }
      
      navigate('/auth/login');
      toast.success("Déconnexion réussie");
    } catch (err: any) {
      console.error("Erreur lors de la déconnexion:", err);
      toast.error(`Erreur lors de la déconnexion: ${err.message}`);
    }
  };

  const isAdmin = !!user && (user.role === UserRole.ADMIN);
  const isSuperAdmin = !!user && (user.role === UserRole.SUPER_ADMIN);
  const isAccountManager = !!user && (user.role === UserRole.ACCOUNT_MANAGER);
  const isFreelancer = !!user && (user.role === UserRole.FREELANCER);
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    role: user?.role as UserRole | null,
    isAdmin,
    isFreelancer,
    isSuperAdmin,
    isAccountManager,
    isAdminOrSuperAdmin,
    loading: isLoading,
    error,
    signIn: handleLogin,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
