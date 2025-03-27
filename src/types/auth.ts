
import { User, UserRole } from "@/types";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  isFreelancer: boolean;
  isSuperAdmin: boolean;
  isAccountManager: boolean;
  isAdminOrSuperAdmin: boolean;
  error: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => Promise<void>;
}
