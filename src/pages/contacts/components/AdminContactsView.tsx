
import React from "react";
import ContactsSearchFilter from "../ContactsSearchFilter";
import ContactsImportExport from "../ContactsImportExport";
import ContactsTable from "../ContactsTable";
import { ContactStatus } from "@/types/database/enums";
import { Contact } from "@/services/contacts/types";

interface AdminContactsViewProps {
  contacts: Contact[];
  loading: boolean;
  searchTerm: string;
  statusFilter: ContactStatus | null;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilterChange: (status: ContactStatus | null) => void;
  onImportComplete: () => void;
}

const AdminContactsView: React.FC<AdminContactsViewProps> = ({
  contacts,
  loading,
  searchTerm,
  statusFilter,
  onSearch,
  onStatusFilterChange,
  onImportComplete
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <ContactsSearchFilter 
          searchTerm={searchTerm}
          onSearchChange={onSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
        />
        <ContactsImportExport onImportComplete={onImportComplete} />
      </div>

      <ContactsTable 
        contacts={contacts}
        loading={loading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
      />
    </>
  );
};

export default AdminContactsView;
