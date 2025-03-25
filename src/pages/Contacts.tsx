
import React, { useState } from "react";
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
import { Plus, Filter, FileDown, FileUp } from "lucide-react";
import { toast } from "sonner";

const Contacts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const contacts = [
    {
      id: "1",
      name: "Alice Martin",
      email: "alice@example.com",
      phone: "+33 6 12 34 56 78",
      company: "Acme Inc.",
      position: "CTO",
      createdAt: new Date(2023, 4, 10),
    },
    {
      id: "2",
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+33 6 23 45 67 89",
      company: "Tech Corp",
      position: "CEO",
      createdAt: new Date(2023, 5, 15),
    },
    {
      id: "3",
      name: "Charlie Brown",
      email: "charlie@example.com",
      phone: "+33 6 34 56 78 90",
      company: "Startup Ltd",
      position: "Marketing",
      createdAt: new Date(2023, 6, 20),
    },
    {
      id: "4",
      name: "Diana Prince",
      email: "diana@example.com",
      phone: "+33 6 45 67 89 01",
      company: "Wonder Co",
      position: "CFO",
      createdAt: new Date(2023, 7, 25),
    },
    {
      id: "5",
      name: "Ethan Hunt",
      email: "ethan@example.com",
      phone: "+33 6 56 78 90 12",
      company: "Mission Inc",
      position: "Sales",
      createdAt: new Date(2023, 8, 30),
    },
  ];

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
    // Dans une implémentation réelle, filtrer les contacts selon searchTerm
  };

  const handleFilter = () => {
    toast("Filtres", {
      description: "Les options de filtrage seront bientôt disponibles."
    });
  };

  const handleViewContact = (contactId: string) => {
    toast.info(`Affichage du contact ${contactId}`, {
      description: "Les détails du contact seront bientôt disponibles."
    });
  };

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
          <Button variant="outline" size="sm" onClick={handleFilter}>
            <Filter className="mr-2 h-4 w-4" /> Filtrer
          </Button>
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
              <TableHead className="hidden md:table-cell">Poste</TableHead>
              <TableHead className="hidden md:table-cell">Date d'ajout</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
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
                  {contact.position}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {contact.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewContact(contact.id)}
                  >
                    Voir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Contacts;
