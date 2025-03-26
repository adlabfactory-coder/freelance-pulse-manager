
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, User } from "@/types";
import { getMockUserById } from "@/utils/supabase-mock-data";
import { toast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: SupabaseUser | User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isFreelancer: boolean;
  isAccountManager: boolean;
  isClient: boolean;
  isDemoMode: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Vérifier s'il y a un utilisateur de démo stocké
    const demoUserStr = localStorage.getItem('demoUser');
    
    if (demoUserStr) {
      try {
        const demoUser = JSON.parse(demoUserStr) as User;
        setUser(demoUser);
        setRole(demoUser.role as UserRole);
        setIsDemoMode(true);
        setLoading(false);
        return; // Ne pas vérifier Supabase si on est en mode démo
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur de démo:", error);
        localStorage.removeItem('demoUser'); // Nettoyer si invalide
      }
    }

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
            
            if (error) {
              console.error("Erreur lors de la récupération du rôle:", error);
              throw error;
            }
            
            if (data) {
              const userRole = data.role as UserRole;
              setRole(userRole);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération du rôle:", error);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de récupérer les informations utilisateur"
            });
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
          try {
            // Récupérer le rôle de l'utilisateur depuis la table users
            const { data, error } = await supabase
              .from("users")
              .select("role")
              .eq("id", session.user.id)
              .single();
            
            if (error) {
              console.error("Erreur lors de la récupération du rôle:", error);
              throw error;
            }
            
            if (data) {
              const userRole = data.role as UserRole;
              setRole(userRole);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération du rôle:", error);
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
    // Vérifier si on est en mode démo
    if (localStorage.getItem('demoUser')) {
      localStorage.removeItem('demoUser');
      setUser(null);
      setRole(null);
      setIsDemoMode(false);
      window.location.href = '/auth/login';
      return;
    }
    
    // Sinon, déconnexion Supabase
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vous déconnecter. Veuillez réessayer."
      });
    }
  };

  const isAdmin = role === UserRole.ADMIN;
  const isFreelancer = role === UserRole.FREELANCER;
  const isAccountManager = role === UserRole.ACCOUNT_MANAGER;
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
        isAccountManager,
        isClient,
        isDemoMode
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
