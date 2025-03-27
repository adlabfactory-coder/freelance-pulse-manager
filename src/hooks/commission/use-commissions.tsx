
import { useAuth } from "@/hooks/use-auth";
import { useFetchCommissions } from "./use-fetch-commissions";
import { useCommissionRules } from "./use-commission-rules";
import { useCommissionOperations } from "./use-commission-operations";
import { useCallback, useState } from "react";
import { Commission } from "@/types/commissions";

export const useCommissions = () => {
  const { user, role } = useAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);

  const { 
    loading: commissionsLoading, 
    error: commissionsError,
    refresh
  } = useFetchCommissions(user?.id || '', role !== undefined);
  
  const { 
    commissionRules, 
    loading: rulesLoading, 
    error: rulesError 
  } = useCommissionRules();
  
  const { 
    requestingPayment, 
    requestPayment, 
    approvePayment, 
    generateMonthlyCommissions 
  } = useCommissionOperations(commissions, setCommissions, role);

  // Combine loading and error states
  const loading = commissionsLoading || rulesLoading;
  const error = commissionsError || rulesError;

  // Utilisation de useCallback pour empêcher les re-renders inutiles
  const refreshCommissions = useCallback(() => {
    // We'll implement this later if needed
    console.log("Refreshing commissions");
    refresh();
  }, [refresh]);

  return {
    commissions,
    commissionRules,
    loading,
    requestingPayment,
    error,
    requestPayment,
    approvePayment,
    generateMonthlyCommissions,
    refreshCommissions
  };
};
