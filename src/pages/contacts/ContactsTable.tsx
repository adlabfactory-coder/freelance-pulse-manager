
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Calendar, Building, Phone } from "lucide-react";
import { Contact } from "@/services/contacts/types";
import { ContactStatus } from "@/types/database/enums";
import ContactStatusBadge from "@/components/contacts/ContactStatusBadge";
import { toast } from "sonner";

interface ContactsTableProps {
  contacts: Contact[];
  loading: boolean;
  searchTerm: string;
  statusFilter: ContactStatus | null;
}

const ContactsTable: React.FC<ContactsTableProps> = ({ 
  contacts, 
  loading,
  searchTerm,
  statusFilter
}) => {
  const navigate = useNavigate();

  const handleViewContact = (contactId: string) => {
    navigate(`/contacts/detail/${contactId}`);
  };

  const filteredContacts = contacts
    .filter(contact => 
      (searchTerm === "" || 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
      ) && 
      (statusFilter === null || contact.status === statusFilter)
    );

  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Téléphone</TableHead>
            <TableHead className="hidden md:table-cell">Entreprise</TableHead>
            <TableHead className="hidden md:table-cell">Statut</TableHead>
            <TableHead className="hidden md:table-cell">Date d'ajout</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Chargement des contacts...
              </TableCell>
            </TableRow>
          ) : filteredContacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Aucun contact trouvé
              </TableCell>
            </TableRow>
          ) : (
            filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {contact.phone}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {contact.company}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <ContactStatusBadge status={contact.status as ContactStatus} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewContact(contact.id)}>
                        <User className="mr-2 h-4 w-4" /> Voir le profil
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" /> Planifier un RDV
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Building className="mr-2 h-4 w-4" /> Associer un abonnement
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Phone className="mr-2 h-4 w-4" /> Appeler
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactsTable;
