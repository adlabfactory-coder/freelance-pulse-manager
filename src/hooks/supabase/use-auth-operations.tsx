
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { User } from '@/types';

export const useAuthOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Error signing in:', error);
        toast("Email ou mot de passe incorrect.");
      } else {
        console.log('Sign in successful:', data);
        toast("Vous êtes maintenant connecté.");
      }
    } catch (error) {
      console.error("Erreur inattendue lors de la connexion:", error);
      toast("Une erreur est survenue lors de la connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast("Impossible de se déconnecter.");
      } else {
        console.log('Sign out successful');
        toast("Vous êtes maintenant déconnecté.");
      }
    } catch (error) {
      console.error("Erreur inattendue lors de la déconnexion:", error);
      toast("Une erreur est survenue lors de la déconnexion.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Error refreshing session:', error);
        toast("Impossible de rafraîchir la session.");
      } 
      
      return data.session;
    } catch (error) {
      console.error("Erreur inattendue lors du rafraîchissement de la session:", error);
      toast("Une erreur est survenue lors du rafraîchissement de la session.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signIn,
    signOut,
    refreshSession,
  };
};
