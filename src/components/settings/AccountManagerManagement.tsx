
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { RefreshCw, UserPlus } from "lucide-react";
import { useAccountManagerManagement } from "@/hooks/useAccountManagerManagement";
import AddAccountManagerForm from "./account-manager/AddAccountManagerForm";
import AccountManagersTable from "./account-manager/AccountManagersTable";
import SearchBar from "./account-manager/SearchBar";

const AccountManagerManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const {
    filteredManagers,
    searchTerm,
    setSearchTerm,
    isLoading,
    isDeleting,
    addAccountManager,
    deleteAccountManager,
    refreshAccountManagers
  } = useAccountManagerManagement();

  const handleAddAccountManager = async (values: { name: string; email: string }) => {
    const success = await addAccountManager(values.name, values.email);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const handleDeleteAccountManager = async (id: string) => {
    await deleteAccountManager(id);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Gestion des chargés de compte</CardTitle>
            <CardDescription>
              Ajoutez, modifiez ou supprimez les chargés de compte
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={refreshAccountManagers} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter un chargé de compte
                </Button>
              </DialogTrigger>
              <AddAccountManagerForm 
                isLoading={isLoading} 
                onSubmit={handleAddAccountManager} 
              />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher un chargé de compte..."
            />
          </div>
          
          <AccountManagersTable
            managers={filteredManagers}
            isLoading={isLoading}
            isDeleting={isDeleting}
            onDelete={handleDeleteAccountManager}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default AccountManagerManagement;
