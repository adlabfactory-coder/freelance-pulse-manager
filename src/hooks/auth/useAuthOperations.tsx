
import { useState } from "react";
import { User, UserRole } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";
import { getMockUsers } from "@/utils/supabase-mock-data";

export const useAuthOperations = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const DEMO_MODE = true;

  const handleLogin = async (email: string, password: string) => {
    try {
      if (DEMO_MODE) {
        console.log("Tentative de connexion en mode démo avec:", email);
        
        const mockUsers = getMockUsers();
        const mockUser = mockUsers.find(u => u.email === email);
        
        if (mockUser) {
          console.log("Utilisateur de démonstration trouvé:", mockUser.name);
          setUser(mockUser);
          // Stocker l'utilisateur dans localStorage pour la persistance en mode démo
          localStorage.setItem('currentUser', JSON.stringify(mockUser));
          toast.success(`Connecté en tant que ${mockUser.name}`);
          return { success: true };
        }
        
        console.log("Email non reconnu, utilisation de l'admin par défaut");
        const defaultAdmin = mockUsers.find(u => u.role === UserRole.ADMIN) || mockUsers[0];
        setUser(defaultAdmin);
        localStorage.setItem('currentUser', JSON.stringify(defaultAdmin));
        toast.success(`Connecté en tant que ${defaultAdmin.name}`);
        
        return { success: true };
      }
      
      console.log("Tentative de connexion à Supabase avec:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Erreur de connexion Supabase:", error.message);
        toast.error(`Erreur de connexion: ${error.message}`);
        return { success: false, error: error.message };
      }
      
      console.log("Connexion Supabase réussie:", data.user?.email);
      toast.success(`Connecté en tant que ${data.user?.email}`);
      
      return { success: true };
    } catch (err: any) {
      console.error("Erreur lors de la connexion:", err.message);
      toast.error(`Erreur lors de la connexion: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  const handleSignUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      if (DEMO_MODE) {
        console.log("Inscription simulée pour:", email, name, role);
        
        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          name,
          role,
          avatar: null
        };
        
        setUser(newUser);
        toast.success("Compte créé avec succès");
        
        return { success: true };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        console.error("Erreur d'inscription Supabase:", error.message);
        toast.error(`Erreur lors de l'inscription: ${error.message}`);
        return { success: false, error: error.message };
      }
      
      toast.success("Compte créé avec succès. Vérifiez votre email pour confirmer l'inscription.");
      return { success: true };
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err.message);
      toast.error(`Erreur lors de l'inscription: ${err.message}`);
      return { success: false, error: err.message };
    }
  };

  return {
    handleLogin,
    handleSignUp
  };
};
