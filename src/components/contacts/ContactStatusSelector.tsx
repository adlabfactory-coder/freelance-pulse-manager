
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
  value?: string;
  currentStatus?: string; // For backward compatibility
  onChange?: (newStatus: string) => void;
  onStatusChange?: (newStatus: string) => void; // For backward compatibility
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
    { value: "lead", label: "Lead" },
    { value: "prospect", label: "Prospect" },
    { value: "negotiation", label: "En négociation" },
    { value: "signed", label: "Signé" },
    { value: "lost", label: "Perdu" },
  ];

  const handleStatusChange = async (status: string) => {
    if (contactId) {
      try {
        // Use updateContact instead of updateContactStatus
        await contactService.updateContact(contactId, { status: status as ContactStatus });
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
            <ContactStatusBadge status={item.value as ContactStatus} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContactStatusSelector;
