
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { AuthContextType } from "@/types/auth";
import { getUserByEmail } from "@/utils/user-list";
import { useAuthOperations } from "./useAuthOperations";
import { useLogout } from "./useLogout";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { handleLogin, handleSignUp } = useAuthOperations(setUser);
  const logout = useLogout();
  
  // Vérifier s'il y a un utilisateur stocké dans localStorage au chargement
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Vérifier si un utilisateur est stocké dans localStorage
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log("Utilisateur trouvé dans localStorage:", parsedUser.name);
        } else {
          setUser(null);
          console.log("Aucun utilisateur trouvé dans localStorage");
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de l'authentification:", err);
        setUser(null);
        setError("Erreur lors de la vérification de l'authentification");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
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
