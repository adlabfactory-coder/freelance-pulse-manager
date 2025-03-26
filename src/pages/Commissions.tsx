
import React from "react";
import { useCommissions } from "@/hooks/commission";
import FreelancerCommissionsList from "@/components/commissions/FreelancerCommissionsList";
import { useAuth } from "@/hooks/use-auth";
import AdminCommissionsContent from "@/components/commissions/AdminCommissionsContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CommissionExplanation from "@/components/commissions/CommissionExplanation";

const Commissions: React.FC = () => {
  const { isAdmin, isFreelancer, isAccountManager } = useAuth();
  const { 
    commissions, 
    commissionRules, 
    loading, 
    requestingPayment, 
    error,
    requestPayment,
    approvePayment,
    generateMonthlyCommissions
  } = useCommissions();

  // Si c'est un chargé d'affaires, afficher un message d'accès restreint
  if (isAccountManager) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Commissions</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès restreint</AlertTitle>
          <AlertDescription>
            En tant que chargé d'affaires, vous n'avez pas accès aux informations sur les commissions.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Afficher l'explication du principe de commissionnement pour tous les utilisateurs autorisés
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        {isFreelancer ? "Mes Commissions" : "Gestion des Commissions"}
      </h1>
      
      {/* Explication du principe de commissionnement */}
      <CommissionExplanation />
      
      {/* Contenu spécifique selon le rôle */}
      {isFreelancer ? (
        <FreelancerCommissionsList />
      ) : (
        <AdminCommissionsContent 
          commissions={commissions}
          commissionRules={commissionRules}
          loading={loading}
          requestingPayment={requestingPayment}
          error={error}
          requestPayment={requestPayment}
          approvePayment={approvePayment}
          generateMonthlyCommissions={generateMonthlyCommissions}
        />
      )}
    </div>
  );
};

export default Commissions;
