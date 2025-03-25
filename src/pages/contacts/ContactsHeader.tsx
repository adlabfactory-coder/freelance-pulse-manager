
import React from "react";
import AddContactDialog from "@/components/contacts/AddContactDialog";

interface ContactsHeaderProps {
  onContactAdded: () => void;
}

const ContactsHeader: React.FC<ContactsHeaderProps> = ({ onContactAdded }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos clients et prospects
        </p>
      </div>
      <AddContactDialog onContactAdded={onContactAdded} />
    </div>
  );
};

export default ContactsHeader;
