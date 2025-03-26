
import React, { useState } from "react";
import { useCommissions } from "@/hooks/use-commissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommissionToolbar from "@/components/commissions/CommissionToolbar";
import CommissionsTable from "@/components/commissions/CommissionsTable";
import FreelancerCommissionsList from "@/components/commissions/FreelancerCommissionsList";
import { useAuth } from "@/hooks/use-auth";

const Commissions: React.FC = () => {
  const { isAdmin, isFreelancer } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { commissions, loading, refetch } = useCommissions(statusFilter);

  // Si c'est un freelancer, afficher la vue freelancer
  if (isFreelancer) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Commissions</h1>
        <FreelancerCommissionsList />
      </div>
    );
  }

  // Sinon, afficher la vue admin
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Commissions</h1>
      
      <CommissionToolbar 
        statusFilter={statusFilter} 
        onStatusFilterChange={setStatusFilter} 
      />
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toutes les commissions</TabsTrigger>
          <TabsTrigger value="summary">Résumé par commercial</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <CommissionsTable 
            commissions={commissions} 
            loading={loading} 
            onStatusChange={refetch}
          />
        </TabsContent>
        <TabsContent value="summary">
          <div className="rounded-lg border p-4">
            <p>Aperçu des commissions par commercial - fonctionnalité à venir</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Commissions;
