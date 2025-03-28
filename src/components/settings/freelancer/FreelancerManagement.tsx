
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, UserPlus } from "lucide-react";
import { useFreelancerManagement } from "@/hooks/useFreelancerManagement";
import FreelancerTable from "./FreelancerTable";
import SearchBar from "../account-manager/SearchBar";
import { useAuth } from "@/hooks/use-auth";

const FreelancerManagement: React.FC<{isAdminOrSuperAdmin: boolean}> = ({ isAdminOrSuperAdmin }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
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

  const filteredFreelancers = searchTerm 
    ? freelancers.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : freelancers;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Gestion des freelances</CardTitle>
            <CardDescription>
              Ajoutez, modifiez ou supprimez les freelances
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTitle>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter un freelance
                </Button>
              </DialogTitle>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un freelance</DialogTitle>
                  <DialogDescription>
                    Créez un nouveau compte pour un freelance dans l'application
                  </DialogDescription>
                </DialogHeader>
                {/* Form component would go here */}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher un freelance..."
            />
          </div>
          
          <FreelancerTable
            freelancers={filteredFreelancers}
            isLoading={loading}
            isDeleting={deletingFreelancer}
            onDelete={(id) => setFreelancerToDelete(id)}
          />

          {/* Delete confirmation dialog would go here */}
        </CardContent>
      </Card>
    </>
  );
};

export default FreelancerManagement;
