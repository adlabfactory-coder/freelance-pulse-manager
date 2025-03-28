
import { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { AuthContextType } from "@/types/auth";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useAuthOperations } from "./useAuthOperations";
import { useLogout } from "./useLogout";
import { supabase } from "@/lib/supabase-client";
import { getMockUsers } from "@/utils/supabase-mock-data";

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
  
  // Use authentication operations hooks
  const { handleLogin, handleSignUp } = useAuthOperations(setUser);
  const logoutFn = useLogout();

  const DEMO_MODE = true;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (DEMO_MODE) {
          // Demo mode authentication
          const shouldBeLoggedIn = localStorage.getItem('currentUser');
          
          if (!shouldBeLoggedIn) {
            console.log("Mode démo: aucun utilisateur actif trouvé dans localStorage");
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          const mockUsers = getMockUsers();
          const defaultUser = mockUsers[0];
          
          console.log("Mode démonstration activé, utilisation d'un utilisateur par défaut:", defaultUser.email);
          setUser(defaultUser);
          localStorage.setItem('currentUser', JSON.stringify(defaultUser));
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
        
        // Supabase authentication
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

  // Calculate role-based flags
  const isAdmin = !!user && (user.role === UserRole.ADMIN);
  const isSuperAdmin = !!user && (user.role === UserRole.SUPER_ADMIN);
  const isAccountManager = !!user && (user.role === UserRole.ACCOUNT_MANAGER);
  const isFreelancer = !!user && (user.role === UserRole.FREELANCER);
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;

  const logout = async () => {
    console.log("Appel à la fonction de déconnexion depuis useAuthContext");
    // Nettoyer immédiatement l'état d'authentification
    setUser(null);
    setSession(null);
    
    // En mode démo, on supprime l'utilisateur du localStorage
    if (DEMO_MODE) {
      localStorage.removeItem('currentUser');
    }
    
    // Appeler le hook de déconnexion pour gérer la déconnexion Supabase et la navigation
    await logoutFn();
  };

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
    signUp: handleSignUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
