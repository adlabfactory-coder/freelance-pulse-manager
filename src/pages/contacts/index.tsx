
import React, { useState, useEffect } from "react";
import { contactService } from "@/services/contacts";
import { Contact } from "@/services/contacts/types";
import { ContactStatus } from "@/types/database/enums";
import ContactsHeader from "./ContactsHeader";
import ContactsSearchFilter from "./ContactsSearchFilter";
import ContactsImportExport from "./ContactsImportExport";
import ContactsTable from "./ContactsTable";
import FreelancerContactsList from "@/components/contacts/FreelancerContactsList";
import { useAuth } from "@/hooks/use-auth";

const Contacts: React.FC = () => {
  const { isAdmin, isFreelancer } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | null>(null);
  
  const fetchContacts = async () => {
    if (!isAdmin) return; // Ne charger pour l'admin uniquement
    
    setLoading(true);
    const data = await contactService.getContacts();
    setContacts(data);
    setLoading(false);
  };
  
  useEffect(() => {
    if (isAdmin) {
      fetchContacts();
    }
  }, [isAdmin]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterByStatus = (status: ContactStatus | null) => {
    setStatusFilter(status);
  };

  // Si c'est un freelancer, afficher la vue freelancer
  if (isFreelancer) {
    return (
      <div className="space-y-6">
        <ContactsHeader onContactAdded={() => {}} />
        <FreelancerContactsList />
      </div>
    );
  }

  // Sinon, afficher la vue admin
  return (
    <div className="space-y-6">
      <ContactsHeader onContactAdded={fetchContacts} />

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <ContactsSearchFilter 
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={handleFilterByStatus}
        />
        <ContactsImportExport onImportComplete={fetchContacts} />
      </div>

      <ContactsTable 
        contacts={contacts}
        loading={loading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
      />
    </div>
  );
};

export default Contacts;
