
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
        toast({
          description: "Email ou mot de passe incorrect.",
          variant: "destructive"
        });
      } else {
        console.log('Sign in successful:', data);
        toast({
          description: "Vous êtes maintenant connecté.",
        });
      }
    } catch (error) {
      console.error("Erreur inattendue lors de la connexion:", error);
      toast({
        description: "Une erreur est survenue lors de la connexion.",
        variant: "destructive"
      });
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
        toast({
          description: "Impossible de se déconnecter.",
          variant: "destructive"
        });
      } else {
        console.log('Sign out successful');
        toast({
          description: "Vous êtes maintenant déconnecté.",
        });
      }
    } catch (error) {
      console.error("Erreur inattendue lors de la déconnexion:", error);
      toast({
          description: "Une erreur est survenue lors de la déconnexion.",
          variant: "destructive"
      });
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
        toast({
          description: "Impossible de rafraîchir la session.",
          variant: "destructive"
        });
      } 
      
      return data.session;
    } catch (error) {
      console.error("Erreur inattendue lors du rafraîchissement de la session:", error);
      toast({
        description: "Une erreur est survenue lors du rafraîchissement de la session.",
        variant: "destructive"
      });
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
