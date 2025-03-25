
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Filter, FileDown, FileUp, User, Building, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import { contactService } from "@/services/contact-service";
import { Contact, ContactStatus } from "@/types";
import ContactStatusBadge from "@/components/contacts/ContactStatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Contacts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | null>(null);
  
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      const data = await contactService.getContacts();
      setContacts(data);
      setLoading(false);
    };
    
    fetchContacts();
  }, []);

  const handleAddContact = () => {
    toast.success("Fonctionnalité à venir", {
      description: "L'ajout de contacts sera bientôt disponible."
    });
  };

  const handleExport = () => {
    toast("Export de contacts", {
      description: "Préparation du fichier d'export..."
    });
    // Dans une implémentation complète, cette fonction téléchargerait un fichier CSV/XLSX
  };

  const handleImport = () => {
    toast("Import de contacts", {
      description: "La fonctionnalité d'import sera bientôt disponible."
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterByStatus = (status: ContactStatus | null) => {
    setStatusFilter(status);
  };

  const handleViewContact = (contactId: string) => {
    toast.info(`Affichage du contact ${contactId}`, {
      description: "Les détails du contact seront bientôt disponibles."
    });
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos clients et prospects
          </p>
        </div>
        <Button onClick={handleAddContact}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un contact
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative w-full md:w-64">
            <Input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={handleSearch}
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
              <DropdownMenuItem onClick={() => handleFilterByStatus(null)}>
                Tous les statuts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleFilterByStatus(ContactStatus.LEAD)}>
                <ContactStatusBadge status={ContactStatus.LEAD} />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterByStatus(ContactStatus.PROSPECT)}>
                <ContactStatusBadge status={ContactStatus.PROSPECT} />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterByStatus(ContactStatus.NEGOTIATION)}>
                <ContactStatusBadge status={ContactStatus.NEGOTIATION} />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterByStatus(ContactStatus.SIGNED)}>
                <ContactStatusBadge status={ContactStatus.SIGNED} />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterByStatus(ContactStatus.LOST)}>
                <ContactStatusBadge status={ContactStatus.LOST} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <FileUp className="mr-2 h-4 w-4" /> Importer
          </Button>
        </div>
      </div>

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
    </div>
  );
};

export default Contacts;
