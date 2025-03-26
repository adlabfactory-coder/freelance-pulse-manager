
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { hasMinimumRole } from "@/types/roles";

// Helper function to check if one role is at least as high as another
// Moved to types/roles.ts

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isFreelancer: boolean;
  isAccountManager?: boolean;
  isSuperAdmin?: boolean;
  isAdminOrSuperAdmin?: boolean;
  role?: UserRole;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut for compatibility
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isFreelancer: false,
  signIn: async () => ({ id: "", name: "", email: "", role: UserRole.CLIENT, avatar: null, calendly_enabled: false, calendly_url: "", calendly_sync_email: "" }),
  signOut: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // En mode développement, auto-connecter l'utilisateur
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    } else {
      // Auto-connecter comme admin
      const adminUser = MOCK_USERS[0];
      setUser(adminUser);
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => {
    // Logique de connexion mockée
    const matchedUser = MOCK_USERS.find(u => u.email === email);
    
    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem("currentUser", JSON.stringify(matchedUser));
      return matchedUser;
    } else {
      // Simulation d'échec de connexion
      throw new Error("Identifiants invalides");
    }
  };

  const signOut = async () => {
    // Logique de déconnexion
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  // Alias for signOut for backwards compatibility
  const logout = signOut;

  // Vérifier les rôles de l'utilisateur
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;
  const isFreelancer = user?.role === UserRole.FREELANCER;
  const isAccountManager = user?.role === UserRole.ACCOUNT_MANAGER;
  const role = user?.role;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      isFreelancer, 
      isAccountManager, 
      isSuperAdmin, 
      isAdminOrSuperAdmin, 
      role,
      signIn, 
      signOut,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock authentication pour le développement
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin Test",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    avatar: null,
    calendly_enabled: false,
    calendly_url: "",
    calendly_sync_email: ""
  },
  {
    id: "2",
    name: "Freelancer Test",
    email: "freelancer@example.com",
    role: UserRole.FREELANCER,
    avatar: null,
    calendly_enabled: true,
    calendly_url: "https://calendly.com/freelancer-test",
    calendly_sync_email: "freelancer@example.com"
  },
  {
    id: "3",
    name: "Client Test",
    email: "client@example.com",
    role: UserRole.CLIENT,
    avatar: null,
    calendly_enabled: false,
    calendly_url: "",
    calendly_sync_email: ""
  }
];

export const useAuth = () => useContext(AuthContext);
