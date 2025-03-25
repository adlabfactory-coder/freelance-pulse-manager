
import React from "react";
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

const Contacts: React.FC = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos clients et prospects
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un contact
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative w-full md:w-64">
            <Input type="text" placeholder="Rechercher..." />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtrer
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button variant="outline" size="sm">
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
                  <Button variant="ghost" size="sm">
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
