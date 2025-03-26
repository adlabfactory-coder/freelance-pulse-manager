
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Commission } from "@/types/commissions";
import { toast } from "@/components/ui/use-toast";
import { createCommissionsService } from "@/services/supabase/commissions";
import { UserRole } from "@/types";

export const useCommissionOperations = (
  commissions: Commission[],
  setCommissions: React.Dispatch<React.SetStateAction<Commission[]>>,
  userRole: UserRole | undefined
) => {
  const [requestingPayment, setRequestingPayment] = useState(false);
  
  const commissionsService = createCommissionsService(supabase as any);

  const requestPayment = async (commissionId: string) => {
    if (!userRole) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour demander un versement",
      });
      return;
    }
    
    setRequestingPayment(true);
    try {
      const success = await commissionsService.requestPayment(commissionId, commissionId, userRole);
      
      if (success) {
        // Mettre à jour localement
        setCommissions(commissions.map(comm => 
          comm.id === commissionId ? { ...comm, paymentRequested: true } : comm
        ));
        
        toast({
          title: "Demande envoyée",
          description: "Votre demande de versement a été envoyée avec succès",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de soumettre votre demande. Veuillez réessayer plus tard.",
      });
    } finally {
      setRequestingPayment(false);
    }
  };

  const approvePayment = async (commissionId: string) => {
    if (userRole !== UserRole.ADMIN) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seul un administrateur peut valider les versements",
      });
      return;
    }
    
    try {
      const success = await commissionsService.approvePayment(commissionId, userRole);
      
      if (success) {
        // Mettre à jour localement
        setCommissions(commissions.map(comm => 
          comm.id === commissionId ? { 
            ...comm, 
            status: 'paid' as any,
            paidDate: new Date()
          } : comm
        ));
        
        toast({
          title: "Paiement validé",
          description: "Le versement a été marqué comme effectué",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la validation du paiement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de valider le paiement. Veuillez réessayer plus tard.",
      });
    }
  };

  const generateMonthlyCommissions = async (month: Date) => {
    if (userRole !== UserRole.ADMIN) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seul un administrateur peut générer les commissions mensuelles",
      });
      return;
    }
    
    try {
      await commissionsService.generateMonthlyCommissions(month, userRole);
      toast({
        title: "Génération en cours",
        description: "Les commissions sont en cours de génération. Veuillez rafraîchir la page dans quelques instants."
      });
    } catch (error) {
      console.error("Erreur lors de la génération des commissions:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer les commissions. Veuillez réessayer plus tard.",
      });
    }
  };

  return {
    requestingPayment,
    requestPayment,
    approvePayment,
    generateMonthlyCommissions
  };
};
