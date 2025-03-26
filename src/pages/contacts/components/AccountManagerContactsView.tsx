
import React from "react";
import ContactsSearchFilter from "../ContactsSearchFilter";
import ContactsTable from "../ContactsTable";
import { ContactStatus } from "@/types/database/enums";
import { Contact } from "@/services/contacts/types";

interface AccountManagerContactsViewProps {
  contacts: Contact[];
  loading: boolean;
  searchTerm: string;
  statusFilter: ContactStatus | null;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilterChange: (status: ContactStatus | null) => void;
}

const AccountManagerContactsView: React.FC<AccountManagerContactsViewProps> = ({
  contacts,
  loading,
  searchTerm,
  statusFilter,
  onSearch,
  onStatusFilterChange
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

export default AccountManagerContactsView;
