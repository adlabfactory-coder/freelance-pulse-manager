
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ContactStatus } from "@/types/database/enums";

interface ContactStatusBadgeProps {
  status: ContactStatus;
}

const ContactStatusBadge: React.FC<ContactStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case ContactStatus.LEAD:
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Lead
        </Badge>
      );
    case ContactStatus.PROSPECT:
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Prospect
        </Badge>
      );
    case ContactStatus.NEGOTIATION:
      return (
        <Badge variant="warning" className="border-amber-200">
          En négociation
        </Badge>
      );
    case ContactStatus.SIGNED:
      return (
        <Badge variant="success" className="border-green-200">
          Signé
        </Badge>
      );
    case ContactStatus.LOST:
      return (
        <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
          Perdu
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
};

export default ContactStatusBadge;
