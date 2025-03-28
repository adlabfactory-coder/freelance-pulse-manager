
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";
import { UserRole } from "@/types/roles";
import { User } from "@/types";

// Extend the User type to include the createdAt property
export interface AccountManager extends User {
  createdAt?: string;
}

export const useAccountManagerManagement = () => {
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<AccountManager[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadAccountManagers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = accountManagers.filter(manager => 
        manager.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        manager.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredManagers(filtered);
    } else {
      setFilteredManagers(accountManagers);
    }
  }, [searchTerm, accountManagers]);

  const loadAccountManagers = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer les chargés de compte depuis Supabase
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, created_at, role")
        .eq("role", "account_manager");
        
      if (error) throw error;
      
      // Convert the data to the User type with the required role property
      const managersWithRole = (data || []).map(user => ({
        ...user,
        role: UserRole.ACCOUNT_MANAGER,
        // Add explicitly all required fields from the User type
        id: user.id,
        name: user.name,
        email: user.email,
        // Using createdAt for the component to render properly
        createdAt: user.created_at
      })) as AccountManager[];
      
      setAccountManagers(managersWithRole);
      setFilteredManagers(managersWithRole);
    } catch (error) {
      console.error("Erreur lors du chargement des chargés de compte:", error);
      toast.error("Impossible de charger les chargés de compte");
    } finally {
      setIsLoading(false);
    }
  };

  const addAccountManager = async (name: string, email: string) => {
    try {
      setIsLoading(true);
      
      // Créer le nouvel utilisateur dans Supabase
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            name: name,
            email: email,
            role: UserRole.ACCOUNT_MANAGER
          }
        ])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newManager = {
          ...data[0],
          role: UserRole.ACCOUNT_MANAGER,
          createdAt: data[0].created_at
        } as AccountManager;
        
        setAccountManagers(prev => [...prev, newManager]);
        
        toast.success(`${name} a été ajouté avec succès comme chargé de compte`);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du chargé de compte:", error);
      toast.error("Impossible d'ajouter le chargé de compte: " + (error.message || 'Erreur inconnue'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccountManager = async (id: string) => {
    try {
      setIsDeleting(true);
      
      // Supprimer l'utilisateur de Supabase
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setAccountManagers(prev => prev.filter(manager => manager.id !== id));
      toast.success("Le chargé de compte a été supprimé avec succès");
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la suppression du chargé de compte:", error);
      toast.error("Impossible de supprimer le chargé de compte: " + (error.message || 'Erreur inconnue'));
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const refreshAccountManagers = async () => {
    await loadAccountManagers();
    toast.success("Liste des chargés de compte actualisée");
  };

  return {
    accountManagers,
    filteredManagers,
    searchTerm,
    setSearchTerm,
    isLoading,
    isDeleting,
    addAccountManager,
    deleteAccountManager,
    refreshAccountManagers
  };
};
