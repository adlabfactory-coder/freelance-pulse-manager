
import { useState } from "react";
import { User, UserRole } from "@/types";

/**
 * Hook to manage the authentication state
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Derived state
  const role = user?.role || null;
  const isAuthenticated = !!user;
  const isAdmin = role === UserRole.ADMIN;
  const isSuperAdmin = role === UserRole.SUPER_ADMIN;
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;
  const isFreelancer = role === UserRole.FREELANCER;
  const isAccountManager = role === UserRole.ACCOUNT_MANAGER;
  
  return {
    // State
    user,
    setUser,
    isLoading,
    setIsLoading,
    error,
    setError,
    
    // Derived state
    role,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isAdminOrSuperAdmin,
    isFreelancer,
    isAccountManager,
  };
};
