
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Contact } from "@/services/contacts/types";

interface ClientSelectorProps {
  selectedContactId?: string;
  contacts: Contact[];
  onSelect: (contactId: string) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
  selectedContactId,
  contacts,
  onSelect
}) => {
  return (
    <div>
      <Label htmlFor="contact">Client</Label>
      <Select
        value={selectedContactId}
        onValueChange={onSelect}
      >
        <SelectTrigger id="contact">
          <SelectValue placeholder="Sélectionner un client" />
        </SelectTrigger>
        <SelectContent>
          {contacts.map(contact => (
            <SelectItem key={contact.id} value={contact.id}>
              {contact.name} ({contact.company || "Particulier"})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelector;
