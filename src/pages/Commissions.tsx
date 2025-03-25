
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Filter, Download, BadgeDollarSign } from "lucide-react";
import { CommissionTier } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useSupabase } from "@/hooks/use-supabase";

const Commissions: React.FC = () => {
  const supabase = useSupabase();
  const [requestingPayment, setRequestingPayment] = useState(false);
  
  const commissions = [
    {
      id: "C-2023-001",
      freelancerName: "John Doe",
      amount: 500,
      tier: CommissionTier.TIER_1,
      period: {
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 4, 31),
      },
      status: "paid",
      paidDate: new Date(2023, 5, 5),
    },
    {
      id: "C-2023-002",
      freelancerName: "Jane Smith",
      amount: 1000,
      tier: CommissionTier.TIER_2,
      period: {
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 4, 31),
      },
      status: "paid",
      paidDate: new Date(2023, 5, 5),
    },
    {
      id: "C-2023-003",
      freelancerName: "Mike Johnson",
      amount: 1500,
      tier: CommissionTier.TIER_3,
      period: {
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 4, 31),
      },
      status: "pending",
      paymentRequested: true,
    },
    {
      id: "C-2023-004",
      freelancerName: "Sarah Wilson",
      amount: 2000,
      tier: CommissionTier.TIER_4,
      period: {
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 4, 31),
      },
      status: "pending",
      paymentRequested: false,
    },
    {
      id: "C-2023-005",
      freelancerName: "John Doe",
      amount: 500,
      tier: CommissionTier.TIER_1,
      period: {
        startDate: new Date(2023, 3, 1),
        endDate: new Date(2023, 3, 30),
      },
      status: "paid",
      paidDate: new Date(2023, 4, 5),
    },
  ];

  const commissionRules = [
    {
      tier: CommissionTier.TIER_1,
      minContracts: 0,
      maxContracts: 10,
      amount: 500,
    },
    {
      tier: CommissionTier.TIER_2,
      minContracts: 11,
      maxContracts: 20,
      amount: 1000,
    },
    {
      tier: CommissionTier.TIER_3,
      minContracts: 21,
      maxContracts: 30,
      amount: 1500,
    },
    {
      tier: CommissionTier.TIER_4,
      minContracts: 31,
      maxContracts: null,
      amount: 2000,
    },
  ];

  const getTierLabel = (tier: CommissionTier) => {
    switch (tier) {
      case CommissionTier.TIER_1:
        return "Palier 1";
      case CommissionTier.TIER_2:
        return "Palier 2";
      case CommissionTier.TIER_3:
        return "Palier 3";
      case CommissionTier.TIER_4:
        return "Palier 4";
      default:
        return "";
    }
  };

  const getStatusBadge = (status: string, paymentRequested: boolean = false) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            Payé
          </span>
        );
      case "pending":
        if (paymentRequested) {
          return (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Demande envoyée
            </span>
          );
        }
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
            En attente
          </span>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
    }).format(amount);
  };

  const formatPeriod = (startDate: Date, endDate: Date) => {
    const startMonth = startDate.toLocaleDateString("fr-FR", { month: "long" });
    const endMonth = endDate.toLocaleDateString("fr-FR", { month: "long" });
    const year = startDate.getFullYear();

    return startMonth === endMonth
      ? `${startMonth} ${year}`
      : `${startMonth} - ${endMonth} ${year}`;
  };
  
  const requestPayment = async (commissionId: string) => {
    setRequestingPayment(true);
    try {
      // Simulation d'une requête vers Supabase pour demander le paiement
      // Dans un cas réel, nous mettrions à jour la base de données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de versement a été envoyée avec succès.",
      });
      
      // Mise à jour de l'UI en attendant une vraie implémentation
      // Dans une implémentation réelle, nous ferions un refetch des données
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande.",
      });
    } finally {
      setRequestingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les commissions des commerciaux
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {commissionRules.map((rule) => (
          <Card key={rule.tier}>
            <CardHeader className="pb-2">
              <CardTitle>{getTierLabel(rule.tier)}</CardTitle>
              <CardDescription>
                {rule.tier === CommissionTier.TIER_1
                  ? `Jusqu'à ${rule.maxContracts} contrats`
                  : rule.maxContracts
                  ? `De ${rule.minContracts} à ${rule.maxContracts} contrats`
                  : `${rule.minContracts}+ contrats`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(rule.amount)}</div>
              <p className="text-sm text-muted-foreground mt-1">
                par contrat
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative w-full md:w-64">
          <Input type="text" placeholder="Rechercher..." />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" /> Filtrer
        </Button>
        <Button variant="outline" size="sm" className="ml-auto">
          <Download className="mr-2 h-4 w-4" /> Exporter
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Commercial</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Palier</TableHead>
              <TableHead className="hidden md:table-cell">Période</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden md:table-cell">Date de paiement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell className="font-medium">{commission.id}</TableCell>
                <TableCell>{commission.freelancerName}</TableCell>
                <TableCell>{formatCurrency(commission.amount)}</TableCell>
                <TableCell>{getTierLabel(commission.tier)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatPeriod(
                    commission.period.startDate,
                    commission.period.endDate
                  )}
                </TableCell>
                <TableCell>
                  {getStatusBadge(commission.status, commission.paymentRequested)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {commission.paidDate
                    ? commission.paidDate.toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {commission.status === "pending" && !commission.paymentRequested ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => requestPayment(commission.id)}
                      disabled={requestingPayment}
                    >
                      <BadgeDollarSign className="mr-2 h-4 w-4" />
                      Demander versement
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Commissions;
