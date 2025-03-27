
import React, { useState } from "react";
import { useContactsData } from "./hooks/useContactsData";
import AdminContactsView from "./components/AdminContactsView";
import FreelancerContactsList from "@/components/contacts/FreelancerContactsList";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

const ContactsPage: React.FC = () => {
  const { 
    contacts, 
    filteredContacts, 
    loading, 
    searchTerm, 
    statusFilter, 
    fetchContacts, 
    handleSearch, 
    handleFilterByStatus
  } = useContactsData();
  
  const { role, isAdminOrSuperAdmin } = useAuth();

  // Utiliser une vue adaptée au rôle de l'utilisateur
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
      
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
      ) : (
        // Vue freelancer avec accès limité
        <FreelancerContactsList 
          contacts={contacts}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ContactsPage;
