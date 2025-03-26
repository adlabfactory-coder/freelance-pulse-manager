
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Contact } from "@/services/contacts/types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ContactStatus } from "@/types/database/enums";
import { MoreHorizontal, FileText, CalendarPlus } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddQuoteDialog from "@/components/quotes/AddQuoteDialog";
import ContactAppointmentDialog from "@/components/contacts/ContactAppointmentDialog";

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
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedContactName, setSelectedContactName] = useState<string>("");
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);

  const handleCreateQuote = (contactId: string) => {
    setSelectedContactId(contactId);
    setQuoteDialogOpen(true);
  };

  const handleCreateAppointment = (contactId: string, contactName: string) => {
    setSelectedContactId(contactId);
    setSelectedContactName(contactName);
    setAppointmentDialogOpen(true);
  };

  // Filtrer les contacts par terme de recherche et statut
  const filteredContacts = contacts.filter(contact => {
    // Filtrer par terme de recherche
    if (searchTerm && !contact.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtrer par statut
    if (statusFilter && contact.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  const handleContactClick = (id: string) => {
    navigate(`/contacts/${id}`);
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[250px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[80px] ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (filteredContacts.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">Aucun contact trouvé.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id} className="cursor-pointer" onClick={() => handleContactClick(contact.id)}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone || "—"}</TableCell>
                <TableCell>{contact.company || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {contact.status === "lead" && "Prospect"}
                    {contact.status === "prospect" && "Client"}
                    {contact.status === "lost" && "Perdu"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleContactClick(contact.id);
                      }}>
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleCreateAppointment(contact.id, contact.name);
                      }}>
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Planifier une consultation initiale
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleCreateQuote(contact.id);
                      }}>
                        <FileText className="mr-2 h-4 w-4" />
                        Créer un devis
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Boîte de dialogue pour créer un devis */}
      <AddQuoteDialog 
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        onQuoteCreated={() => setQuoteDialogOpen(false)}
        initialContactId={selectedContactId || undefined}
      />

      {/* Boîte de dialogue pour planifier un rendez-vous */}
      <ContactAppointmentDialog
        open={appointmentDialogOpen} 
        onOpenChange={setAppointmentDialogOpen}
        contactId={selectedContactId || ""}
        contactName={selectedContactName}
        initialType="consultation-initiale"
      />
    </>
  );
};

export default ContactsTable;
