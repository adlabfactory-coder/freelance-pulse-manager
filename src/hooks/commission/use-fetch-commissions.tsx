
import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Commission, CommissionTier } from "@/types/commissions";
import { User, UserRole } from "@/types";
import { createCommissionsService } from "@/services/supabase/commissions";

export const useFetchCommissions = (user: User | null, role: UserRole | undefined) => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const commissionsService = createCommissionsService(supabase as any);
  const isFreelancer = role === UserRole.FREELANCER;
  const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
  
  // Utiliser useRef pour suivre si les données ont déjà été chargées
  const dataFetchedRef = useRef(false);

  const fetchCommissions = useCallback(async () => {
    if (!user) {
      setCommissions([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier d'abord la connexion Supabase
      try {
        const { data, error } = await supabase.from('commissions').select('count', { count: 'exact', head: true });
        if (error) {
          throw new Error(`Problème d'accès à la base de données: ${error.message}`);
        }
      } catch (connError: any) {
        console.warn("Vérification de connexion échouée:", connError.message || connError);
        throw new Error("Impossible de se connecter à la base de données");
      }
      
      const data = await commissionsService.fetchCommissions(user.id, role || UserRole.CLIENT);
      setCommissions(data);
    } catch (error: any) {
      console.error("Erreur lors du chargement des commissions:", error);
      setError("Impossible de récupérer les commissions. Veuillez réessayer plus tard.");
      
      // Simuler des données pour l'interface utilisateur en cas d'erreur
      if (isFreelancer) {
        setCommissions([
          {
            id: "offline-commission-1",
            freelancerId: user.id,
            freelancerName: user.name || "Freelancer",
            amount: 1200,
            tier: CommissionTier.TIER_2,
            periodStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0),
            status: "pending" as any,
            paymentRequested: false,
            period: `${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleDateString()} - ${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0).toLocaleDateString()}`
          }
        ]);
      } else if (isAdmin) {
        setCommissions([
          {
            id: "offline-commission-admin-1",
            freelancerId: "offline-user-1",
            freelancerName: "John Doe (Hors ligne)",
            amount: 950,
            tier: CommissionTier.TIER_1,
            periodStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0),
            status: "pending" as any,
            paymentRequested: true,
            period: `${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleDateString()} - ${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0).toLocaleDateString()}`
          },
          {
            id: "offline-commission-admin-2",
            freelancerId: "offline-user-2",
            freelancerName: "Jane Smith (Hors ligne)",
            amount: 1800,
            tier: CommissionTier.TIER_3,
            periodStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0),
            status: "paid" as any,
            paidDate: new Date(),
            paymentRequested: true,
            period: `${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleDateString()} - ${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0).toLocaleDateString()}`
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [user, role, commissionsService, isFreelancer, isAdmin]);

  useEffect(() => {
    // Chargement unique des données seulement
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      fetchCommissions();
    }
  }, [fetchCommissions]);

  return {
    commissions,
    setCommissions,
    loading,
    error,
    fetchCommissions
  };
};
