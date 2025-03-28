
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import CreateFreelancerForm from "./CreateFreelancerForm";
import { useAuth } from "@/hooks/use-auth";
import { FreelancerTable, DeleteFreelancerDialog } from "./freelancer";
import { useFreelancerManagement, Freelancer } from "@/hooks/useFreelancerManagement";

const FreelancerManagement: React.FC = () => {
  const { isAdminOrSuperAdmin } = useAuth();
  
  const {
    freelancers,
    loading,
    showCreateForm,
    setShowCreateForm,
    freelancerToDelete,
    setFreelancerToDelete,
    deletingFreelancer,
    handleDeleteFreelancer,
    handleCreateSuccess,
    handleRefresh
  } = useFreelancerManagement(isAdminOrSuperAdmin);

  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des freelances</CardTitle>
          <CardDescription>
            Vous n'avez pas les droits pour accéder à cette section.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestion des freelances</CardTitle>
            <CardDescription>
              Liste des freelances ayant accès à la plateforme
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {showCreateForm ? "Annuler" : "Ajouter un freelance"}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {showCreateForm && (
            <div className="mb-6">
              <CreateFreelancerForm onSuccess={handleCreateSuccess} />
            </div>
          )}
          
          <FreelancerTable
            freelancers={freelancers}
            loading={loading}
            onDeleteClick={(id) => setFreelancerToDelete(id)}
          />
        </CardContent>
      </Card>

      <DeleteFreelancerDialog
        isOpen={!!freelancerToDelete}
        isDeleting={deletingFreelancer}
        onConfirm={handleDeleteFreelancer}
        onCancel={() => setFreelancerToDelete(null)}
      />
    </div>
  );
};

export default FreelancerManagement;
