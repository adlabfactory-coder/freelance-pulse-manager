import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Commission, CommissionTier } from "@/types/commissions";
import { User, UserRole } from "@/types";
import { createCommissionsService } from "@/services/supabase/commissions";
import { hasMinimumRole } from "@/types/roles";

export const useFetchCommissions = (user: User | null, role: UserRole | undefined) => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const commissionsService = createCommissionsService(supabase as any);
  const isFreelancer = role === UserRole.FREELANCER;
  const isAdmin = role === UserRole.ADMIN;
  const isSuperAdmin = role === UserRole.SUPER_ADMIN;
  const hasAdminAccess = isAdmin || isSuperAdmin;
  
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
      
      try {
        const { data, error } = await supabase.from('commissions').select('count', { count: 'exact', head: true });
        if (error) {
          throw new Error(`Problème d'accès à la base de données: ${error.message}`);
        }
      } catch (connError: any) {
        console.warn("Vérification de connexion échouée:", connError.message || connError);
        throw new Error("Impossible de se connecter à la base de données");
      }
      
      const effectiveRole = role === UserRole.SUPER_ADMIN ? UserRole.ADMIN : role;
      const data = await commissionsService.fetchCommissions(user.id, effectiveRole || UserRole.FREELANCER);
      setCommissions(data);
    } catch (error: any) {
      console.error("Erreur lors du chargement des commissions:", error);
      setError("Impossible de récupérer les commissions. Veuillez réessayer plus tard.");
      
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
            payment_requested: false,
            period: `${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleDateString()} - ${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0).toLocaleDateString()}`
          }
        ]);
      } else if (hasAdminAccess) {
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
            payment_requested: true,
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
            payment_requested: true,
            period: `${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleDateString()} - ${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0).toLocaleDateString()}`
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [user, role, commissionsService, isFreelancer, hasAdminAccess]);

  useEffect(() => {
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
