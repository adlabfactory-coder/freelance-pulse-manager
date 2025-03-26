
import React, { useState } from "react";
import { useCommissions } from "@/hooks/use-commissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FreelancerCommissionsList from "@/components/commissions/FreelancerCommissionsList";
import { useAuth } from "@/hooks/use-auth";

// Créons un composant séparé pour les commissions admin
const AdminCommissionsContent: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { commissions, loading } = useCommissions();
  
  // Nous allons implémenter ce composant plus tard
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toutes les commissions</TabsTrigger>
          <TabsTrigger value="summary">Résumé par commercial</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="rounded-lg border p-4">
            <p>Liste des commissions - {commissions.length} commissions trouvées</p>
          </div>
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

const Commissions: React.FC = () => {
  const { isAdmin, isFreelancer } = useAuth();

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
      <AdminCommissionsContent />
    </div>
  );
};

export default Commissions;
