
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useContactsData } from "./hooks/useContactsData";
import AddContactDialog from "@/components/contacts/AddContactDialog";
import AdminContactsView from "./components/AdminContactsView";
import FreelancerContactsList from "@/components/contacts/FreelancerContactsList";
import { ContactStatus } from "@/types/database/enums";

const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isFreelancer, user } = useAuth();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
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

  const handleContactAdded = () => {
    setAddDialogOpen(false);
    fetchContacts();
  };

  const renderContactsView = () => {
    if (isAdmin) {
      return (
        <AdminContactsView
          contacts={contacts}
          loading={loading}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearch={handleSearch}
          onStatusFilterChange={handleFilterByStatus}
          onImportComplete={fetchContacts}
        />
      );
    } else if (isFreelancer) {
      return (
        <FreelancerContactsList
          contacts={contacts}
          loading={loading}
        />
      );
    }
    
    return (
      <div className="text-center p-8">
        <p>Vous n'avez pas accès à cette page.</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un contact
        </Button>
      </div>

      {renderContactsView()}

      <AddContactDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={handleContactAdded}
      />
    </div>
  );
};

export default ContactsPage;
