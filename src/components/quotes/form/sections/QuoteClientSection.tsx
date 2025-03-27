
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Contact } from "@/services/contacts/types";

interface QuoteClientSectionProps {
  selectedContactId: string;
  contacts: Contact[];
  onContactChange: (contactId: string) => void;
}

const QuoteClientSection: React.FC<QuoteClientSectionProps> = ({
  selectedContactId,
  contacts,
  onContactChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="contact">Client</Label>
      <Select
        value={selectedContactId}
        onValueChange={onContactChange}
      >
        <SelectTrigger id="contact">
          <SelectValue placeholder="Sélectionner un client" />
        </SelectTrigger>
        <SelectContent>
          {contacts.map(contact => (
            <SelectItem key={contact.id} value={contact.id}>
              {contact.name} {contact.company ? `(${contact.company})` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuoteClientSection;
