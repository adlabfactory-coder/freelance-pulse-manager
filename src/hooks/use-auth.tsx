import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

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
    isFreelancer,
    isAccountManager,
    isClient,
    role: user?.role
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
