
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Subscription } from "@/types";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";
import { formatCurrency, formatDate } from "@/utils/format";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  loading: boolean;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Abonnements actifs</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de début</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Abonnements actifs</h2>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Aucun abonnement actif.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Abonnements actifs</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell className="font-medium">{subscription.clientName || "Client inconnu"}</TableCell>
                <TableCell>{subscription.name}</TableCell>
                <TableCell>{formatCurrency(subscription.price)}</TableCell>
                <TableCell>
                  <SubscriptionStatusBadge status={subscription.status} />
                </TableCell>
                <TableCell>{formatDate(subscription.startDate)}</TableCell>
                <TableCell className="text-right">
                  {/* Actions pour gérer l'abonnement */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubscriptionList;
