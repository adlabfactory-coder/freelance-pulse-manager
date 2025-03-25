
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ContactStatus } from "@/types/database/enums";
import ContactStatusBadge from "@/components/contacts/ContactStatusBadge";

interface ContactsSearchFilterProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: ContactStatus | null;
  onStatusFilterChange: (status: ContactStatus | null) => void;
}

const ContactsSearchFilter: React.FC<ContactsSearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center">
      <div className="relative w-full md:w-64">
        <Input 
          type="text" 
          placeholder="Rechercher..." 
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> 
            {statusFilter ? (
              <span className="flex items-center gap-2">
                Statut: <ContactStatusBadge status={statusFilter} />
              </span>
            ) : (
              "Filtrer par statut"
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onStatusFilterChange(null)}>
            Tous les statuts
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onStatusFilterChange("lead")}>
            <ContactStatusBadge status="lead" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("prospect")}>
            <ContactStatusBadge status="prospect" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("negotiation")}>
            <ContactStatusBadge status="negotiation" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("signed")}>
            <ContactStatusBadge status="signed" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("lost")}>
            <ContactStatusBadge status="lost" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ContactsSearchFilter;
