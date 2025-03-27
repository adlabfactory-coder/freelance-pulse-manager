
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase-client";
import { User, UserRole } from "@/types";
import { getMockUsers } from "@/utils/supabase-mock-data";
import { AuthContextType } from "@/types/auth";
import { toast } from "sonner";

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

  // Configuration du mode démo
  const DEMO_MODE = true; // Mettre à true pour utiliser des utilisateurs simulés

  // Vérification de l'état de l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (DEMO_MODE) {
          // Mode démo activé, utiliser un utilisateur simulé par défaut
          const mockUsers = getMockUsers();
          const defaultUser = mockUsers[0]; // Super Admin
          
          console.log("Mode démonstration activé, utilisation d'un utilisateur par défaut:", defaultUser.email);
          setUser(defaultUser);
          setIsLoading(false);
          
          // Test de la connexion à Supabase en mode silencieux
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
        
        // Si le mode démo est désactivé, vérifier la session Supabase
        // IMPORTANT: D'abord configurer l'écouteur d'événements auth state, puis vérifier la session
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Auth state changed:", event, session?.user?.email);
            setUser(session?.user ? mapSupabaseUser(session.user) : null);
            setIsLoading(false);
          }
        );

        // Ensuite vérifier la session existante
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Session existante trouvée:", session.user.email);
          setUser(mapSupabaseUser(session.user));
        } else {
          console.log("Aucune session existante trouvée");
          setUser(null);
        }
        setIsLoading(false);
        
        // Cleanup
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

  // Convertir un utilisateur Supabase en format d'utilisateur de l'application
  const mapSupabaseUser = (supabaseUser: any): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
      role: (supabaseUser.user_metadata?.role || 'admin') as UserRole,
      avatar: supabaseUser.user_metadata?.avatar || null
    };
  };

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
      if (DEMO_MODE) {
        console.log("Tentative de connexion en mode démo avec:", email);
        
        // Mode de démonstration
        const mockUsers = getMockUsers();
        const mockUser = mockUsers.find(u => u.email === email);
        
        if (mockUser) {
          console.log("Utilisateur de démonstration trouvé:", mockUser.name);
          setUser(mockUser);
          toast.success(`Connecté en tant que ${mockUser.name}`);
          return { success: true };
        }
        
        // Si l'email ne correspond à aucun utilisateur de démo, utiliser l'admin par défaut
        console.log("Email non reconnu, utilisation de l'admin par défaut");
        const defaultAdmin = mockUsers.find(u => u.role === UserRole.ADMIN) || mockUsers[0];
        setUser(defaultAdmin);
        toast.success(`Connecté en tant que ${defaultAdmin.name}`);
        
        return { success: true };
      }
      
      // Mode réel, utiliser Supabase
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
      const mappedUser = mapSupabaseUser(data.user);
      setUser(mappedUser);
      toast.success(`Connecté en tant que ${mappedUser.name}`);
      
      return { success: true };
    } catch (err: any) {
      console.error("Erreur lors de la connexion:", err.message);
      toast.error(`Erreur lors de la connexion: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  // Fonction d'inscription
  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      if (DEMO_MODE) {
        // En mode démo, simuler une inscription réussie
        console.log("Inscription simulée pour:", email, name, role);
        
        // Créer un nouvel utilisateur simulé
        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          name,
          role,
          avatar: null
        };
        
        // Définir cet utilisateur comme courant
        setUser(newUser);
        toast.success("Compte créé avec succès");
        
        return { success: true };
      }
      
      // En mode réel, utiliser Supabase
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

  // Fonction de déconnexion
  const logout = async () => {
    try {
      if (DEMO_MODE) {
        // En mode démo, simplement réinitialiser l'état
        setUser(null);
        navigate('/auth/login');
        toast.success("Déconnexion réussie");
        return;
      }
      
      // En mode réel, utiliser Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erreur lors de la déconnexion Supabase:", error.message);
        toast.error(`Erreur lors de la déconnexion: ${error.message}`);
        return;
      }
      
      setUser(null);
      navigate('/auth/login');
      toast.success("Déconnexion réussie");
    } catch (err: any) {
      console.error("Erreur lors de la déconnexion:", err);
      toast.error(`Erreur lors de la déconnexion: ${err.message}`);
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
