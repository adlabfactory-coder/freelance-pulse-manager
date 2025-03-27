
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const useAppointmentFreelancers = () => {
  const { user } = useAuth();
  const [defaultFreelancer, setDefaultFreelancer] = useState<string | null>(null);
  const [isLoadingFreelancer, setIsLoadingFreelancer] = useState(true);
  
  useEffect(() => {
    const fetchDefaultFreelancer = async () => {
      console.log("useAppointmentFreelancers: Recherche d'un freelancer par défaut");
      setIsLoadingFreelancer(true);
      
      try {
        if (user?.role === 'freelancer') {
          setDefaultFreelancer(user.id);
          console.log("useAppointmentFreelancers: Utilisateur freelancer trouvé, ID utilisé:", user.id);
        } else {
          console.log("useAppointmentFreelancers: Recherche d'un freelancer par défaut dans la base de données");
          const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('role', 'freelancer')
            .limit(1);
            
          if (!error && data && data.length > 0) {
            console.log("useAppointmentFreelancers: Freelancer par défaut trouvé:", data[0].id);
            setDefaultFreelancer(data[0].id);
          } else {
            console.warn("useAppointmentFreelancers: Aucun freelancer trouvé pour l'assignation par défaut:", error);
            toast.warning("Aucun freelancer disponible. Mode auto-assignation activé.");
          }
        }
      } catch (error) {
        console.error("useAppointmentFreelancers: Erreur lors de la récupération d'un freelancer par défaut:", error);
        toast.error("Erreur lors de la recherche d'un freelancer disponible.");
      } finally {
        setIsLoadingFreelancer(false);
      }
    };
    
    fetchDefaultFreelancer();
  }, [user]);

  return {
    defaultFreelancer,
    isLoadingFreelancer,
    isUserFreelancer: user?.role === 'freelancer'
  };
};
