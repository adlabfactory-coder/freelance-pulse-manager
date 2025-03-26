
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { User, UserRole, hasMinimumRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";

// Mock data for demonstration purposes
const MOCK_USER: User = {
  id: "1",
  name: "Admin Démo",
  email: "admin@example.com",
  role: UserRole.ADMIN,
  avatar: null,
  calendly_enabled: false,
  calendly_url: "",
  calendly_sync_email: ""
};

// Context pour l'authentification
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isFreelancer: boolean;
  isAccountManager: boolean;
  isClient: boolean;
  isAdminOrSuperAdmin: boolean;
  role: UserRole | null;
  hasMinimumRole: (requiredRole: UserRole | string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [loading, setLoading] = useState(true);

  // Démo: simuler une vérification de session initiale
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Dans un environnement réel, on vérifierait la session avec Supabase
        // const { data: { session } } = await supabase.auth.getSession();
        // setUser(session ? session.user : null);
        
        // Vérifier d'abord si un utilisateur de démo est stocké
        const demoUser = localStorage.getItem('demoUser');
        if (demoUser) {
          setUser(JSON.parse(demoUser));
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error);
        setUser(null);
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Détermine si l'utilisateur a un certain rôle minimum
  const checkMinimumRole = (requiredRole: UserRole | string): boolean => {
    if (!user) return false;
    return hasMinimumRole(user.role, requiredRole);
  };

  // Propriétés calculées pour les vérifications de rôle courantes
  const isAdmin = !!user && user.role === UserRole.ADMIN;
  const isSuperAdmin = !!user && user.role === UserRole.SUPER_ADMIN;
  const isFreelancer = !!user && user.role === UserRole.FREELANCER;
  const isAccountManager = !!user && user.role === UserRole.ACCOUNT_MANAGER;
  const isClient = !!user && user.role === UserRole.CLIENT;
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;
  const isAuthenticated = !!user;
  const role = user?.role as UserRole || null;

  // Fonctions d'authentification (simulations pour démo)
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Dans un environnement réel, on utiliserait Supabase
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) throw error;
      // setUser(data.user);
      setUser(MOCK_USER);
      localStorage.setItem('demoUser', JSON.stringify(MOCK_USER));
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Une erreur s'est produite lors de la connexion"
      });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Dans un environnement réel: await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('demoUser');
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
    } catch (error: any) {
      console.error("Erreur de déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur s'est produite lors de la déconnexion"
      });
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isFreelancer,
    isAccountManager,
    isClient,
    isAdminOrSuperAdmin,
    role,
    hasMinimumRole: checkMinimumRole,
    login,
    logout
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
