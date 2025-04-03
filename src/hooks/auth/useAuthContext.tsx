
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { AuthContextType } from "@/types/auth";
import { getUserByEmail } from "@/utils/user-list";
import { useAuthOperations } from "./useAuthOperations";
import { useLogout } from "./useLogout";
import { supabase } from "@/lib/supabase"; // Import standardisé
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { handleLogin, handleSignUp } = useAuthOperations(setUser);
  const { logout } = useLogout();
  
  // Vérifier la session au chargement et s'abonner aux changements d'état d'authentification
  useEffect(() => {
    // Définir un délai de sécurité pour éviter les problèmes de déconnexion infinie
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Mode de production
        const DEMO_MODE = false;
        
        if (!DEMO_MODE) {
          // Récupérer la session actuelle
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("Erreur lors de la récupération de la session:", sessionError);
            setUser(null);
            setError(sessionError.message);
            return;
          }
          
          const session = sessionData?.session;
          
          if (session && session.user) {
            // Récupérer les détails utilisateur supplémentaires depuis la table users
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, name, email, role, avatar')
              .eq('id', session.user.id)
              .single();
              
            if (userError || !userData) {
              console.error("Erreur lors de la récupération des détails utilisateur:", userError);
              setUser(null);
            } else {
              setUser({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role as UserRole,
                avatar: userData.avatar
              });
            }
          } else {
            setUser(null);
            console.log("Aucune session active trouvée");
          }
        } else {
          // Mode démo (utilisant localStorage)
          const storedUser = localStorage.getItem('currentUser');
          
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log("Utilisateur trouvé dans localStorage:", parsedUser.name);
          } else {
            setUser(null);
            console.log("Aucun utilisateur trouvé dans localStorage");
          }
        }
      } catch (err: any) {
        console.error("Erreur lors de la vérification de l'authentification:", err);
        setUser(null);
        setError("Erreur lors de la vérification de l'authentification: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Configuration d'un écouteur pour les changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Événement d'authentification détecté:", event);
        
        if (event === 'SIGNED_IN' && session) {
          // Nettoyer le délai si l'utilisateur se reconnecte
          if (timeoutId) clearTimeout(timeoutId);
          
          // Mettre à jour les détails utilisateur avec une opération asynchrone différée
          setTimeout(async () => {
            try {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id, name, email, role, avatar')
                .eq('id', session.user.id)
                .single();
                
              if (!userError && userData) {
                setUser({
                  id: userData.id,
                  name: userData.name,
                  email: userData.email,
                  role: userData.role as UserRole,
                  avatar: userData.avatar
                });
              }
            } catch (err) {
              console.error("Erreur lors de la récupération des détails utilisateur:", err);
            }
          }, 0);
        }
        
        if (event === 'SIGNED_OUT') {
          // Délai avant la déconnexion complète pour éviter les boucles infinies
          timeoutId = setTimeout(() => {
            setUser(null);
          }, 200);
        }
      }
    );
    
    // Nettoyage de l'écouteur au démontage du composant
    return () => {
      authListener.subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      // Vérifier les informations d'identification
      const demoUser = getUserByEmail(email);
      
      if (demoUser && demoUser.password === password) {
        return handleLogin(email, password);
      }
      
      return {
        success: false,
        error: "Identifiants incorrects"
      };
    } catch (err: any) {
      console.error("Erreur lors de la connexion:", err);
      return {
        success: false,
        error: err.message || "Une erreur est survenue lors de la connexion"
      };
    }
  };
  
  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      return handleSignUp(email, password, name, role);
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err);
      return {
        success: false,
        error: err.message || "Une erreur est survenue lors de l'inscription"
      };
    }
  };
  
  const role = user?.role || null;
  const isAuthenticated = !!user;
  const isAdmin = role === UserRole.ADMIN;
  const isSuperAdmin = role === UserRole.SUPER_ADMIN;
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;
  const isFreelancer = role === UserRole.FREELANCER;
  const isAccountManager = role === UserRole.ACCOUNT_MANAGER;
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        role,
        isAdmin,
        isSuperAdmin,
        isAdminOrSuperAdmin,
        isFreelancer,
        isAccountManager,
        error,
        loading: isLoading,
        signIn,
        signUp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuthContext doit être utilisé à l'intérieur d'un AuthProvider");
  }
  
  return context;
};
