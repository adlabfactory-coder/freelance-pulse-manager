
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Contact } from "@/services/contacts/types";

interface ClientSelectorProps {
  contactId?: string;
  contacts: Contact[];
  onSelect: (contactId: string) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
  contactId,
  contacts,
  onSelect
}) => {
  return (
    <div>
      <Label htmlFor="contact">Contact</Label>
      <Select
        value={contactId}
        onValueChange={onSelect}
      >
        <SelectTrigger id="contact">
          <SelectValue placeholder="Sélectionner un contact" />
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

export default ClientSelector;
