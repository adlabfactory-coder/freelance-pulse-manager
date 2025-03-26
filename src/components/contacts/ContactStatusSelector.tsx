
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
  currentStatus?: ContactStatus; // For backward compatibility
  onChange?: (newStatus: ContactStatus) => void;
  onStatusChange?: (newStatus: ContactStatus) => void; // For backward compatibility
}

const ContactStatusSelector: React.FC<ContactStatusSelectorProps> = ({ 
  contactId, 
  value,
  currentStatus,
  onChange,
  onStatusChange
}) => {
  // Use value prop if provided, otherwise use currentStatus for backward compatibility
  const currentValue = value || currentStatus;
  
  // Use onChange if provided, otherwise use onStatusChange for backward compatibility
  const handleChange = onChange || onStatusChange;
  
  const statusItems = [
    { value: "lead" as ContactStatus, label: "Lead" },
    { value: "prospect" as ContactStatus, label: "Prospect" },
    { value: "negotiation" as ContactStatus, label: "En négociation" },
    { value: "signed" as ContactStatus, label: "Signé" },
    { value: "lost" as ContactStatus, label: "Perdu" },
  ];

  const handleStatusChange = async (status: ContactStatus) => {
    if (contactId) {
      try {
        // Use updateContact instead of updateContactStatus
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
