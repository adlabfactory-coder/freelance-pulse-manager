
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { User, UserRole } from "@/types";
import { toast } from "sonner";
import { useUserOperations } from "@/hooks/supabase/use-user-operations";

export interface Freelancer extends User {
  createdAt?: string;
}

export const useFreelancerManagement = (isAdminOrSuperAdmin: boolean) => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [freelancerToDelete, setFreelancerToDelete] = useState<string | null>(null);
  const [deletingFreelancer, setDeletingFreelancer] = useState(false);
  const { deleteUser } = useUserOperations();

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
        .select("id, name, email, created_at, role")
        .eq("role", "freelancer");

      if (error) throw error;
      
      console.log("Freelancers récupérés:", data);
      
      // Transformer les données pour les rendre compatibles avec le type User
      const formattedFreelancers = (data || []).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: UserRole.FREELANCER,
        createdAt: user.created_at // Utiliser la colonne created_at récemment ajoutée
      })) as Freelancer[];
      
      setFreelancers(formattedFreelancers);
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
      
      // Utiliser le hook useUserOperations pour supprimer l'utilisateur
      const success = await deleteUser(freelancerToDelete);

      if (success) {
        setFreelancers(prevFreelancers => 
          prevFreelancers.filter(freelancer => freelancer.id !== freelancerToDelete)
        );
        
        toast.success("Le freelance a été supprimé avec succès");
      } else {
        throw new Error("Échec de la suppression");
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

  return {
    freelancers,
    loading,
    showCreateForm,
    setShowCreateForm,
    freelancerToDelete,
    setFreelancerToDelete,
    deletingFreelancer,
    handleDeleteFreelancer,
    handleCreateSuccess,
    handleRefresh
  };
};
