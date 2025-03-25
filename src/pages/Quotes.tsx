
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
import { Filter, Plus, FileDown, FileUp } from "lucide-react";
import { QuoteStatus } from "@/types";
import { formatCurrency } from "@/utils/format";

const Quotes: React.FC = () => {
  const quotes = [
    {
      id: "Q-2023-001",
      contactName: "Alice Martin",
      freelancerName: "John Doe",
      totalAmount: 3500,
      status: QuoteStatus.SENT,
      createdAt: new Date(2023, 4, 10),
      validUntil: new Date(2023, 5, 10),
    },
    {
      id: "Q-2023-002",
      contactName: "Bob Johnson",
      freelancerName: "Jane Smith",
      totalAmount: 1200,
      status: QuoteStatus.ACCEPTED,
      createdAt: new Date(2023, 4, 15),
      validUntil: new Date(2023, 5, 15),
    },
    {
      id: "Q-2023-003",
      contactName: "Charlie Brown",
      freelancerName: "John Doe",
      totalAmount: 5000,
      status: QuoteStatus.REJECTED,
      createdAt: new Date(2023, 4, 20),
      validUntil: new Date(2023, 5, 20),
    },
    {
      id: "Q-2023-004",
      contactName: "Diana Prince",
      freelancerName: "Jane Smith",
      totalAmount: 2300,
      status: QuoteStatus.DRAFT,
      createdAt: new Date(2023, 4, 25),
      validUntil: new Date(2023, 5, 25),
    },
    {
      id: "Q-2023-005",
      contactName: "Ethan Hunt",
      freelancerName: "John Doe",
      totalAmount: 4500,
      status: QuoteStatus.EXPIRED,
      createdAt: new Date(2023, 4, 30),
      validUntil: new Date(2023, 5, 30),
    },
  ];

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10">
            Brouillon
          </span>
        );
      case QuoteStatus.SENT:
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Envoyé
          </span>
        );
      case QuoteStatus.ACCEPTED:
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            Accepté
          </span>
        );
      case QuoteStatus.REJECTED:
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
            Refusé
          </span>
        );
      case QuoteStatus.EXPIRED:
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
            Expiré
          </span>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devis</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos devis et propositions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Créer un devis
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
              <TableHead>Numéro</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Commercial</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden md:table-cell">
                Date de création
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Valide jusqu'au
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">{quote.id}</TableCell>
                <TableCell>{quote.contactName}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {quote.freelancerName}
                </TableCell>
                <TableCell>{formatCurrency(quote.totalAmount)}</TableCell>
                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {quote.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {quote.validUntil.toLocaleDateString()}
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

export default Quotes;
