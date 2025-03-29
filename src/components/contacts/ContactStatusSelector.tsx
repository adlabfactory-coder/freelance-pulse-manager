
import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { contactService } from "@/services/contacts";
import { ContactStatus } from "@/types/database/enums";
import ContactStatusBadge from "./ContactStatusBadge";

interface ContactStatusSelectorProps {
  contactId?: string;
  value?: ContactStatus;
  currentStatus?: ContactStatus;
  onChange?: (newStatus: ContactStatus) => void;
  onStatusChange?: (newStatus: ContactStatus) => void;
}

const ContactStatusSelector: React.FC<ContactStatusSelectorProps> = ({ 
  contactId, 
  value,
  currentStatus,
  onChange,
  onStatusChange
}) => {
  const currentValue = value || currentStatus;
  const handleChange = onChange || onStatusChange;
  
  const statusItems = [
    { value: ContactStatus.LEAD, label: "Lead" },
    { value: ContactStatus.PROSPECT, label: "Prospect" },
    { value: ContactStatus.NEGOTIATION, label: "En négociation" },
    { value: ContactStatus.SIGNED, label: "Signé" },
    { value: ContactStatus.LOST, label: "Perdu" },
  ];

  const handleStatusChange = async (status: ContactStatus) => {
    if (contactId) {
      try {
        await contactService.updateContact(contactId, { status });
        if (handleChange) {
          handleChange(status);
        }
      } catch (error) {
        console.error("Error updating contact status:", error);
      }
    } else if (handleChange) {
      handleChange(status);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ContactStatusBadge status={currentValue as ContactStatus} />
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {statusItems.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => handleStatusChange(item.value)}
            className="flex items-center gap-2"
          >
            {currentValue === item.value && (
              <Check className="h-4 w-4" />
            )}
            <ContactStatusBadge status={item.value} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContactStatusSelector;
