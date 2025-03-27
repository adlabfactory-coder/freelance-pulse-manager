
import { User } from './user';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<User | null>;
  isAdmin: boolean;
  isAccountManager: boolean;
  isFreelancer: boolean;
  isAdminOrSuperAdmin: boolean;
}
