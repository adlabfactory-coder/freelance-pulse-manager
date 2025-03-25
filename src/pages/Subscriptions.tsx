
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
import { Filter, Plus } from "lucide-react";
import { SubscriptionInterval, SubscriptionStatus } from "@/types";

const Subscriptions: React.FC = () => {
  const subscriptions = [
    {
      id: "S-2023-001",
      name: "Plan Premium",
      clientName: "Alice Martin",
      freelancerName: "John Doe",
      price: 99.99,
      interval: SubscriptionInterval.MONTHLY,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(2023, 4, 10),
      renewalDate: new Date(2023, 5, 10),
    },
    {
      id: "S-2023-002",
      name: "Plan Entreprise",
      clientName: "Bob Johnson",
      freelancerName: "Jane Smith",
      price: 299.99,
      interval: SubscriptionInterval.YEARLY,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(2023, 3, 15),
      renewalDate: new Date(2024, 3, 15),
    },
    {
      id: "S-2023-003",
      name: "Plan Standard",
      clientName: "Charlie Brown",
      freelancerName: "John Doe",
      price: 49.99,
      interval: SubscriptionInterval.MONTHLY,
      status: SubscriptionStatus.CANCELED,
      startDate: new Date(2023, 2, 20),
      renewalDate: new Date(2023, 3, 20),
    },
    {
      id: "S-2023-004",
      name: "Plan Premium",
      clientName: "Diana Prince",
      freelancerName: "Jane Smith",
      price: 99.99,
      interval: SubscriptionInterval.MONTHLY,
      status: SubscriptionStatus.TRIAL,
      startDate: new Date(2023, 4, 25),
      renewalDate: new Date(2023, 5, 25),
    },
    {
      id: "S-2023-005",
      name: "Plan Entreprise",
      clientName: "Ethan Hunt",
      freelancerName: "John Doe",
      price: 799.99,
      interval: SubscriptionInterval.QUARTERLY,
      status: SubscriptionStatus.EXPIRED,
      startDate: new Date(2023, 1, 30),
      renewalDate: new Date(2023, 4, 30),
    },
  ];

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            Actif
          </span>
        );
      case SubscriptionStatus.CANCELED:
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
            Annulé
          </span>
        );
      case SubscriptionStatus.EXPIRED:
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
            Expiré
          </span>
        );
      case SubscriptionStatus.PENDING:
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            En attente
          </span>
        );
      case SubscriptionStatus.TRIAL:
        return (
          <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
            Essai
          </span>
        );
      default:
        return null;
    }
  };

  const getIntervalLabel = (interval: SubscriptionInterval) => {
    switch (interval) {
      case SubscriptionInterval.MONTHLY:
        return "Mensuel";
      case SubscriptionInterval.QUARTERLY:
        return "Trimestriel";
      case SubscriptionInterval.YEARLY:
        return "Annuel";
      default:
        return "";
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
          <h1 className="text-3xl font-bold tracking-tight">Abonnements</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les abonnements de vos clients
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouvel abonnement
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative w-full md:w-64">
          <Input type="text" placeholder="Rechercher..." />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" /> Filtrer
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Commercial</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="hidden md:table-cell">Périodicité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden md:table-cell">
                Prochaine échéance
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell className="font-medium">{subscription.id}</TableCell>
                <TableCell>{subscription.name}</TableCell>
                <TableCell>{subscription.clientName}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {subscription.freelancerName}
                </TableCell>
                <TableCell>{formatCurrency(subscription.price)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {getIntervalLabel(subscription.interval)}
                </TableCell>
                <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {subscription.renewalDate.toLocaleDateString()}
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

export default Subscriptions;
