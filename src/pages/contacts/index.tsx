
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import ContactsHeader from "./ContactsHeader";
import FreelancerContactsList from "@/components/contacts/FreelancerContactsList";
import { useContactsData } from "./hooks/useContactsData";
import { useContactStatusListeners } from "./hooks/useContactStatusListeners";
import { usePendingQuotesCheck } from "./hooks/usePendingQuotesCheck";
import AdminContactsView from "./components/AdminContactsView";
import AccountManagerContactsView from "./components/AccountManagerContactsView";

const Contacts: React.FC = () => {
  const { isAdmin, isFreelancer, isAccountManager } = useAuth();
  
  const {
    contacts,
    filteredContacts,
    loading,
    searchTerm,
    statusFilter,
    fetchContacts,
    handleSearch,
    handleFilterByStatus
  } = useContactsData(isAdmin, isFreelancer, isAccountManager);
  
  // Set up contact status listeners
  useContactStatusListeners(contacts);
  
  // Check for pending quotes
  usePendingQuotesCheck(isAccountManager, isAdmin);

  // Si c'est un freelancer, afficher la vue freelancer
  if (isFreelancer) {
    return (
      <div className="space-y-6">
        <ContactsHeader onContactAdded={fetchContacts} />
        <FreelancerContactsList contacts={contacts} loading={loading} />
      </div>
    );
  }

  // Pour les chargés de compte, afficher une vue similaire à celle de l'admin
  if (isAccountManager) {
    return (
      <div className="space-y-6">
        <ContactsHeader onContactAdded={fetchContacts} />
        <AccountManagerContactsView
          contacts={filteredContacts}
          loading={loading}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearch={handleSearch}
          onStatusFilterChange={handleFilterByStatus}
        />
      </div>
    );
  }

  // Sinon, afficher la vue admin
  return (
    <div className="space-y-6">
      <ContactsHeader onContactAdded={fetchContacts} />
      <AdminContactsView
        contacts={filteredContacts}
        loading={loading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearch={handleSearch}
        onStatusFilterChange={handleFilterByStatus}
        onImportComplete={fetchContacts}
      />
    </div>
  );
};

export default Contacts;
