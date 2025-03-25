
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { SubscriptionInterval, SubscriptionStatus } from "@/types";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";
import SubscriptionIntervalLabel from "./SubscriptionIntervalLabel";

interface Subscription {
  id: string;
  name: string;
  clientName: string;
  freelancerName: string;
  price: number;
  interval: SubscriptionInterval;
  status: SubscriptionStatus;
  startDate: Date;
  renewalDate: Date;
}

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions }) => {
  return (
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
                <SubscriptionIntervalLabel interval={subscription.interval} />
              </TableCell>
              <TableCell>
                <SubscriptionStatusBadge status={subscription.status} />
              </TableCell>
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
  );
};

export default SubscriptionList;
