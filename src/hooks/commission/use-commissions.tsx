
import { useAuth } from "@/hooks/use-auth";
import { useFetchCommissions } from "./use-fetch-commissions";
import { useCommissionRules } from "./use-commission-rules";
import { useCommissionOperations } from "./use-commission-operations";

export const useCommissions = () => {
  const { user, role } = useAuth();
  
  const { 
    commissions, 
    setCommissions, 
    loading: commissionsLoading, 
    error: commissionsError,
    fetchCommissions 
  } = useFetchCommissions(user, role);
  
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

  return {
    commissions,
    commissionRules,
    loading,
    requestingPayment,
    error,
    requestPayment,
    approvePayment,
    generateMonthlyCommissions,
  };
};
