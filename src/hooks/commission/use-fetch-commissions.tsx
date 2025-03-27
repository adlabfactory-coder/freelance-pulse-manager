import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { Commission, CommissionStatus, CommissionTier } from "@/types/commissions";
import { User } from "@/types/user";
import { toast } from "sonner";

export const useFetchCommissions = (userId?: string, isAdmin: boolean = false) => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchCommissions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Utiliser des données simulées en attendant l'intégration avec la base de données
      // En production, ces données proviendraient de Supabase
      setTimeout(() => {
        // Simuler un appel à la base de données
        const mockCommissions: Commission[] = [
          {
            id: "1",
            freelancerId: "1",
            tier: "gold",
            amount: 1250.00,
            status: "paid" as CommissionStatus,
            periodStart: new Date('2023-01-01'),
            periodEnd: new Date('2023-01-31'),
            paidDate: new Date('2023-02-05'),
            payment_requested: true,
            contracts_count: 15,
            createdAt: new Date('2023-01-31'),
            freelancerName: 'John Doe'
          },
          {
            id: "2",
            freelancerId: "1",
            tier: "gold",
            amount: 1400.00,
            status: "pending" as CommissionStatus,
            periodStart: new Date('2023-02-01'),
            periodEnd: new Date('2023-02-28'),
            payment_requested: true,
            contracts_count: 16,
            createdAt: new Date('2023-02-28'),
            freelancerName: 'John Doe'
          },
          {
            id: "3",
            freelancerId: "1",
            tier: "platinum",
            amount: 2300.00,
            status: "pending" as CommissionStatus,
            periodStart: new Date('2023-03-01'),
            periodEnd: new Date('2023-03-31'),
            payment_requested: false,
            contracts_count: 23,
            createdAt: new Date('2023-03-31'),
            freelancerName: 'John Doe'
          },
        ];

        setCommissions(mockCommissions);
        setLoading(false);
      }, 800);
      
    } catch (err: any) {
      console.error("Erreur lors de la récupération des commissions:", err);
      setError("Impossible de charger les commissions");
      toast.error("Erreur lors du chargement des commissions");
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCommissions();
  }, [userId]);
  
  const requestPayment = async (commissionId: string) => {
    try {
      // Simuler la mise à jour dans la base de données
      setCommissions(prev => 
        prev.map(commission => 
          commission.id === commissionId 
            ? { ...commission, payment_requested: true } 
            : commission
        )
      );
      
      toast.success("Demande de versement envoyée avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la demande de versement:", error);
      toast.error("Erreur lors de la demande de versement");
      return false;
    }
  };
  
  const approvePayment = async (commissionId: string) => {
    try {
      // Simuler la mise à jour dans la base de données
      setCommissions(prev => 
        prev.map(commission => 
          commission.id === commissionId 
            ? { 
                ...commission, 
                status: "paid" as CommissionStatus,
                paidDate: new Date(),
              } 
            : commission
        )
      );
      
      toast.success("Paiement approuvé avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'approbation du paiement:", error);
      toast.error("Erreur lors de l'approbation du paiement");
      return false;
    }
  };
  
  return {
    commissions,
    loading,
    error,
    requestPayment,
    approvePayment,
    refresh: fetchCommissions
  };
};
