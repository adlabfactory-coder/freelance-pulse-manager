
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ? {
        id: session.user.id,
        name: session.user.user_metadata.full_name || session.user.email,
        email: session.user.email,
        role: (session.user.user_metadata.role || UserRole.FREELANCER) as UserRole,
        avatar: session.user.user_metadata.avatar_url,
        calendly_url: session.user.user_metadata.calendly_url,
        calendly_sync_email: session.user.user_metadata.calendly_sync_email,
        calendly_enabled: session.user.user_metadata.calendly_enabled
      } : null);
      setIsLoading(false);
    }

    getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ? {
        id: session.user.id,
        name: session.user.user_metadata.full_name || session.user.email,
        email: session.user.email,
        role: (session.user.user_metadata.role || UserRole.FREELANCER) as UserRole,
        avatar: session.user.user_metadata.avatar_url,
        calendly_url: session.user.user_metadata.calendly_url,
        calendly_sync_email: session.user.user_metadata.calendly_sync_email,
        calendly_enabled: session.user.user_metadata.calendly_enabled
      } : null);
    })
  }, []);

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vous déconnecter. Veuillez réessayer."
      });
    }
  };

  // Vérifier si l'utilisateur est un super admin
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  
  // Vérifier si l'utilisateur est un admin ou super admin
  const isAdminOrSuperAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  
  // Vérifier si l'utilisateur est un admin
  const isAdmin = user?.role === UserRole.ADMIN;
  
  // Vérifier si l'utilisateur est un freelance
  const isFreelancer = user?.role === UserRole.FREELANCER;
  
  // Vérifier si l'utilisateur est un chargé d'affaires
  const isAccountManager = user?.role === UserRole.ACCOUNT_MANAGER;
  
  // Vérifier si l'utilisateur est un client
  const isClient = user?.role === UserRole.CLIENT;

  return {
    user,
    session,
    isLoading,
    isAdmin,
    isSuperAdmin,
    isAdminOrSuperAdmin,
    isFreelancer,
    isAccountManager,
    isClient,
    role: user?.role,
    signOut
  };
};

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: authUser } = await supabase.auth.getUser();

        if (!authUser?.user) {
          setError('Not authenticated');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.user.id)
          .single();

        if (error) {
          setError(error.message);
          return;
        }

        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          avatar: data.avatar,
          calendly_url: data.calendly_url,
          calendly_sync_email: data.calendly_sync_email,
          calendly_enabled: data.calendly_enabled
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
