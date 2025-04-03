
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "./useAuthState";
import { useSession } from "./useSession";
import { useAuthOperations } from "./useAuthOperations";
import { useLogout } from "./useLogout";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Use the refactored auth state hook
  const {
    user, setUser,
    isLoading, setIsLoading,
    error, setError,
    role,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isAdminOrSuperAdmin,
    isFreelancer,
    isAccountManager,
  } = useAuthState();
  
  // Use the session management hook
  useSession(setUser, setIsLoading, setError);
  
  // Import authentication operations
  const { handleLogin, handleSignUp } = useAuthOperations(setUser);
  const { logout } = useLogout();
  
  const signIn = async (email: string, password: string) => {
    try {
      return handleLogin(email, password);
    } catch (err: any) {
      console.error("Error during login:", err);
      return {
        success: false,
        error: err.message || "An error occurred during login"
      };
    }
  };
  
  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      return handleSignUp(email, password, name, role);
    } catch (err: any) {
      console.error("Error during registration:", err);
      return {
        success: false,
        error: err.message || "An error occurred during registration"
      };
    }
  };
  
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
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  
  return context;
};
