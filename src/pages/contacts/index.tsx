
import React, { useState, useEffect } from "react";
import { contactService } from "@/services/contacts";
import { Contact, ContactStatus } from "@/types";
import ContactsHeader from "./ContactsHeader";
import ContactsSearchFilter from "./ContactsSearchFilter";
import ContactsImportExport from "./ContactsImportExport";
import ContactsTable from "./ContactsTable";

const Contacts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | null>(null);
  
  const fetchContacts = async () => {
    setLoading(true);
    const data = await contactService.getContacts();
    setContacts(data);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterByStatus = (status: ContactStatus | null) => {
    setStatusFilter(status);
  };

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
