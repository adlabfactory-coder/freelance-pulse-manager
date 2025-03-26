
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { hasMinimumRole } from "@/types/roles";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isFreelancer: boolean;
  isAccountManager?: boolean;
  isSuperAdmin?: boolean;
  isAdminOrSuperAdmin?: boolean;
  isAuthenticated: boolean;
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
  isAuthenticated: false,
  signIn: async () => ({ id: "", name: "", email: "", role: UserRole.ADMIN, avatar: null }),
  signOut: async () => {},
  logout: async () => {},
});

// UUID générés pour remplacer les IDs simples (1, 2, 3...)
const MOCK_USERS = [
  {
    id: "7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc", // Remplacé ID "1"
    name: "Admin Test",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    avatar: null
  },
  {
    id: "487fb1af-4396-49d1-ba36-8711facbb03c", // Remplacé ID "2"
    name: "Freelancer Test",
    email: "freelancer@example.com",
    role: UserRole.FREELANCER,
    avatar: null
  },
  {
    id: "6a94bd3d-7f5c-49ae-b09e-e570cb01a978", // Remplacé ID "4"
    name: "Super Admin Test",
    email: "superadmin@example.com",
    role: UserRole.SUPER_ADMIN,
    avatar: null
  },
  {
    id: "3f8e3f1c-c6f9-4c04-a0b9-88d7f6d8e05c", // Remplacé ID "5"
    name: "Account Manager Test",
    email: "manager@example.com",
    role: UserRole.ACCOUNT_MANAGER,
    avatar: null
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    } else {
      const adminUser = MOCK_USERS[0];
      setUser(adminUser);
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => {
    const matchedUser = MOCK_USERS.find(u => u.email === email);
    
    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem("currentUser", JSON.stringify(matchedUser));
      return matchedUser;
    } else {
      throw new Error("Identifiants invalides");
    }
  };

  const signOut = async () => {
    // Déconnexion de l'utilisateur
    setUser(null);
    localStorage.removeItem("currentUser");
    
    // Supprimer également la session Supabase si elle existe
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erreur lors de la déconnexion Supabase:", error);
    }
  };

  const logout = signOut;

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;
  const isFreelancer = user?.role === UserRole.FREELANCER;
  const isAccountManager = user?.role === UserRole.ACCOUNT_MANAGER;
  const isAuthenticated = !!user;
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
      isAuthenticated,
      role,
      signIn, 
      signOut,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
