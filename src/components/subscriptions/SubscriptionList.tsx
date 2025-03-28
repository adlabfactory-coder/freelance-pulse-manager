import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Subscription } from "@/types";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";
import { formatCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, FileText, AlertTriangle, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  loading: boolean;
}

const formatDate = (date: string | Date) => {
  if (!date) return "-";
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy');
};

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, loading }) => {
  const { toast } = useToast();

  const handleRenewSubscription = (subscriptionId: string) => {
    toast({
      title: "Renouvellement demandé",
      description: `Demande de renouvellement pour l'abonnement #${subscriptionId.substring(0, 8)}`,
    });
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    toast({
      title: "Annulation demandée",
      description: `Demande d'annulation pour l'abonnement #${subscriptionId.substring(0, 8)}`,
      variant: "destructive",
    });
  };

  const handleEditSubscription = (subscriptionId: string) => {
    toast({
      title: "Modification",
      description: `Modification de l'abonnement #${subscriptionId.substring(0, 8)}`,
    });
  };

  const handleGenerateInvoice = (subscriptionId: string) => {
    toast({
      title: "Génération de facture",
      description: `Génération de facture pour l'abonnement #${subscriptionId.substring(0, 8)}`,
    });
  };

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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditSubscription(subscription.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleGenerateInvoice(subscription.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Générer facture</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRenewSubscription(subscription.id)}>
                        <Check className="mr-2 h-4 w-4" />
                        <span>Renouveler</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleCancelSubscription(subscription.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span>Annuler</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
