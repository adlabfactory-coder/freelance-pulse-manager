
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { User } from "@/types";
import { toast } from "sonner";
import { useInitializeUsers } from "@/hooks/useInitializeUsers";

export interface Freelancer {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export const useFreelancerManagement = (isAdminOrSuperAdmin: boolean) => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [freelancerToDelete, setFreelancerToDelete] = useState<string | null>(null);
  const [deletingFreelancer, setDeletingFreelancer] = useState(false);
  
  const { 
    isInitializing, 
    isInitialized, 
    error: initError, 
    initializeUsers, 
    reset: resetInitialization 
  } = useInitializeUsers();

  useEffect(() => {
    if (isAdminOrSuperAdmin) {
      fetchFreelancers();
    }
  }, [isAdminOrSuperAdmin]);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "freelancer")
        .is("deleted_at", null);

      if (error) throw error;

      console.log("Freelancers récupérés:", data);
      setFreelancers(data || []);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des freelances:", error);
      toast.error("Impossible de récupérer la liste des freelances");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFreelancer = async () => {
    if (!freelancerToDelete) return;

    try {
      setDeletingFreelancer(true);
      
      // Utiliser la fonction RPC soft_delete_user au lieu de la mise à jour directe
      const { data, error } = await supabase.rpc('soft_delete_user', {
        user_id: freelancerToDelete,
        current_user_role: 'admin' // À remplacer par le rôle réel de l'utilisateur si disponible
      });

      if (error) throw error;

      // Vérifier si l'opération a réussi
      if (data && data.success) {
        setFreelancers(prevFreelancers => 
          prevFreelancers.filter(freelancer => freelancer.id !== freelancerToDelete)
        );
        
        toast.success(data.message || "Le freelance a été supprimé et sera définitivement effacé dans 48 heures");
      } else {
        toast.error(data?.error || "Impossible de supprimer le freelance");
      }
    } catch (error: any) {
      console.error("Erreur lors de la suppression du freelance:", error);
      toast.error("Impossible de supprimer le freelance: " + (error.message || 'Erreur inconnue'));
    } finally {
      setDeletingFreelancer(false);
      setFreelancerToDelete(null);
    }
  };

  const handleCreateSuccess = (newFreelancer: Freelancer) => {
    setFreelancers(prev => [...prev, newFreelancer]);
    setShowCreateForm(false);
    toast.success(`Le freelance ${newFreelancer.name} a été ajouté avec succès`);
  };

  const handleRefresh = async () => {
    await fetchFreelancers();
    toast.success("Liste des freelances actualisée");
  };

  const handleInitializeUsers = async () => {
    await initializeUsers();
    await fetchFreelancers();
  };

  return {
    freelancers,
    loading,
    showCreateForm,
    setShowCreateForm,
    freelancerToDelete,
    setFreelancerToDelete,
    deletingFreelancer,
    isInitializing,
    isInitialized,
    initError,
    resetInitialization,
    handleDeleteFreelancer,
    handleCreateSuccess,
    handleRefresh,
    handleInitializeUsers
  };
};
