
import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useUserOperations } from './use-user-operations';
import { useAuthOperations } from './use-auth-operations';
import { useDatabaseStatus } from './use-database-status';
import { User } from '@/types';

// Type pour les résultats d'opérations avec feedback d'erreur
export interface OperationResult {
  success: boolean;
  error?: string;
}

// Type for the context value
export interface SupabaseContextType {
  supabaseClient: typeof supabase;
  // User operations
  fetchUsers: () => Promise<User[]>;
  fetchUserById: (id: string) => Promise<User | null>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id'>) => Promise<{ success: boolean; id?: string }>;
  deleteUser: (id: string) => Promise<OperationResult>;
  getMockUsers: () => User[];
  // Auth operations
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<any>;
  // Database operations
  checkSupabaseStatus: () => Promise<{ success: boolean; message?: string }>;
  checkDatabaseStatus: () => Promise<any>;
  initializeDatabase: (options?: any) => Promise<any>;
}

// Create the context with a default value
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Export the provider component
export const SupabaseProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const userOperations = useUserOperations();
  const authOperations = useAuthOperations();
  const dbOperations = useDatabaseStatus();

  const value: SupabaseContextType = {
    supabaseClient: supabase,
    // User operations
    fetchUsers: userOperations.fetchUsers,
    fetchUserById: userOperations.fetchUserById,
    updateUser: userOperations.updateUser,
    createUser: userOperations.createUser,
    deleteUser: userOperations.deleteUser,
    getMockUsers: userOperations.getMockUsers,
    // Auth operations
    signIn: authOperations.signIn,
    signOut: authOperations.signOut,
    refreshSession: authOperations.refreshSession,
    // Database operations
    checkSupabaseStatus: dbOperations.checkSupabaseStatus,
    checkDatabaseStatus: dbOperations.checkDatabaseStatus,
    initializeDatabase: dbOperations.initializeDatabase
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

// Export a hook to use the context
export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
