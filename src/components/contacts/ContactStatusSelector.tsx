
import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { contactService } from "@/services/contact-service";
import { ContactStatus } from "@/types";
import ContactStatusBadge from "./ContactStatusBadge";

interface ContactStatusSelectorProps {
  contactId: string;
  currentStatus: ContactStatus;
  onStatusChange?: (newStatus: ContactStatus) => void;
}

const ContactStatusSelector: React.FC<ContactStatusSelectorProps> = ({ 
  contactId, 
  currentStatus,
  onStatusChange
}) => {
  const statusItems = [
    { value: ContactStatus.LEAD, label: "Lead" },
    { value: ContactStatus.PROSPECT, label: "Prospect" },
    { value: ContactStatus.NEGOTIATION, label: "En négociation" },
    { value: ContactStatus.SIGNED, label: "Signé" },
    { value: ContactStatus.LOST, label: "Perdu" },
  ];

  const handleStatusChange = async (status: ContactStatus) => {
    const result = await contactService.updateContactStatus(contactId, status);
    if (result && onStatusChange) {
      onStatusChange(status);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ContactStatusBadge status={currentStatus} />
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
            {currentStatus === item.value && (
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
