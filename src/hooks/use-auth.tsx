
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase-client";
import { User, UserRole } from "@/types";
import { getMockUsers } from "@/utils/supabase-mock-data";
import { AuthContextType } from "@/types/auth";

// Context pour l'authentification
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Vérification de l'état de l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erreur lors de la récupération de la session:", error);
          setIsLoading(false);
          return;
        }
        
        if (sessionData.session) {
          // Session valide, récupérer les informations utilisateur
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", sessionData.session.user.id)
            .single();
          
          if (userError) {
            console.error("Erreur lors de la récupération des données utilisateur:", userError);
            setIsLoading(false);
            return;
          }
          
          if (userData) {
            setUser(userData as User);
          }
        } else {
          // Mode démonstration avec un utilisateur mocké
          const mockUsers = getMockUsers();
          if (mockUsers && mockUsers.length > 0) {
            setUser(mockUsers[0]);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de l'authentification:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Écouteur pour les changements de session
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      if (event === 'SIGNED_IN' && session) {
        // Connexion réussie, récupérer les infos utilisateur
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (!userError && userData) {
          setUser(userData as User);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/auth/login');
      }
    });
    
    checkAuth();
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Déterminer les rôles utilisateur
  const role = user?.role as UserRole | null;
  const isAdmin = role === UserRole.ADMIN;
  const isSuperAdmin = role === UserRole.SUPER_ADMIN;
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;
  const isFreelancer = role === UserRole.FREELANCER;
  const isAccountManager = role === UserRole.ACCOUNT_MANAGER;
  const isAuthenticated = !!user;

  // Fonction de connexion
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erreur de connexion:", error.message);
        return { success: false, error: error.message };
      }
      
      if (data?.user) {
        // Récupérer les informations utilisateur depuis la table users
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();
        
        if (userError) {
          console.error("Erreur lors de la récupération des données utilisateur:", userError);
          return { success: true }; // On considère quand même que la connexion est réussie
        }
        
        if (userData) {
          setUser(userData as User);
        }
        
        return { success: true };
      }
      
      // Mode de démonstration
      const mockUsers = getMockUsers();
      const mockUser = mockUsers.find(u => u.email === email);
      if (mockUser) {
        setUser(mockUser);
        return { success: true };
      }
      
      return { success: false, error: "Identifiants invalides" };
    } catch (err: any) {
      console.error("Erreur lors de la connexion:", err.message);
      return { success: false, error: err.message };
    }
  };

  // Fonction d'inscription
  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/auth/login');
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    role,
    isAdmin,
    isFreelancer,
    isSuperAdmin,
    isAccountManager,
    isAdminOrSuperAdmin,
    loading: isLoading,
    error,
    signIn,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
