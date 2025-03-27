
import React, { useState } from "react";
import { useContactsData } from "./hooks/useContactsData";
import AdminContactsView from "./components/AdminContactsView";
import AccountManagerContactsView from "./components/AccountManagerContactsView";
import FreelancerContactsList from "@/components/contacts/FreelancerContactsList";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const ContactsPage: React.FC = () => {
  const { 
    contacts, 
    filteredContacts, 
    loading, 
    error,
    searchTerm, 
    statusFilter, 
    fetchContacts, 
    handleSearch, 
    handleFilterByStatus
  } = useContactsData();
  
  const { role, isAdminOrSuperAdmin } = useAuth();

  // Message de déboggage
  console.log("État actuel de la page contacts:", { 
    contactsCount: contacts.length, 
    filteredCount: filteredContacts.length, 
    loading, 
    error,
    role,
    isAdmin: isAdminOrSuperAdmin
  });

  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <Alert variant="destructive">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchContacts} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <Button onClick={fetchContacts} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>
      
      {isAdminOrSuperAdmin ? (
        // Vue admin avec toutes les fonctionnalités
        <AdminContactsView 
          contacts={filteredContacts}
          loading={loading}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearch={handleSearch}
          onStatusFilterChange={handleFilterByStatus}
          onImportComplete={fetchContacts}
        />
      ) : role === UserRole.ACCOUNT_MANAGER ? (
        // Vue account manager avec accès limité
        <AccountManagerContactsView 
          contacts={filteredContacts}
          loading={loading}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearch={handleSearch}
          onStatusFilterChange={handleFilterByStatus}
        />
      ) : (
        // Vue freelancer avec accès limité
        <FreelancerContactsList 
          contacts={contacts}
          loading={loading}
        />
      )}

      {contacts.length === 0 && !loading && (
        <Alert>
          <AlertTitle>Aucun contact trouvé</AlertTitle>
          <AlertDescription>
            Aucun contact n'a été trouvé dans la base de données. Utilisez le bouton d'importation ou ajoutez des contacts manuellement.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ContactsPage;
