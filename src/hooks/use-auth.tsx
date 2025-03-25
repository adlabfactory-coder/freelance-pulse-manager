
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isFreelancer: boolean;
  isClient: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            // Récupérer le rôle de l'utilisateur depuis la table users
            const { data, error } = await supabase
              .from("users")
              .select("role")
              .eq("id", session.user.id)
              .single();
            
            if (error) throw error;
            
            if (data) {
              const userRole = data.role as UserRole;
              setRole(userRole);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération du rôle:", error);
          }
        } else {
          setRole(null);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Récupérer la session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Récupérer le rôle de l'utilisateur depuis la table users
          const { data, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            const userRole = data.role as UserRole;
            setRole(userRole);
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'authentification:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = role === UserRole.ADMIN;
  const isFreelancer = role === UserRole.FREELANCER;
  const isClient = role === UserRole.CLIENT;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        loading,
        signOut,
        isAdmin,
        isFreelancer,
        isClient
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
