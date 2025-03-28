
import React from "react";
import { SubscriptionInterval, SubscriptionStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";

interface SubscriptionDataProps {
  name: string;
  price: number;
  interval: SubscriptionInterval;
  status: SubscriptionStatus;
  startDate: Date | string;
  endDate?: Date | null;
  clientName?: string;
  freelancerName?: string;
}

// Mapping des statuts vers des couleurs
const statusColors: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: "bg-green-500",
  [SubscriptionStatus.INACTIVE]: "bg-gray-500",
  [SubscriptionStatus.PENDING]: "bg-yellow-500",
  [SubscriptionStatus.CANCELLED]: "bg-red-500",
  [SubscriptionStatus.EXPIRED]: "bg-red-500",
  [SubscriptionStatus.TRIAL]: "bg-purple-500"
};

// Mapping des intervalles vers du texte lisible
const intervalLabels: Record<SubscriptionInterval, string> = {
  [SubscriptionInterval.MONTHLY]: "Mensuel",
  [SubscriptionInterval.QUARTERLY]: "Trimestriel",
  [SubscriptionInterval.BIANNUAL]: "Semestriel",
  [SubscriptionInterval.ANNUAL]: "Annuel",
  [SubscriptionInterval.YEARLY]: "Annuel",
  [SubscriptionInterval.CUSTOM]: "Personnalisé"
};

// Mapping des statuts vers du texte lisible
const statusLabels: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: "Actif",
  [SubscriptionStatus.INACTIVE]: "Inactif",
  [SubscriptionStatus.PENDING]: "En attente",
  [SubscriptionStatus.CANCELLED]: "Annulé",
  [SubscriptionStatus.EXPIRED]: "Expiré",
  [SubscriptionStatus.TRIAL]: "Essai"
};

const SubscriptionData: React.FC<SubscriptionDataProps> = ({
  name,
  price,
  interval,
  status,
  startDate,
  endDate,
  clientName,
  freelancerName
}) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Informations principales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prix:</span>
                <span className="font-medium">{formatCurrency(price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Intervalle:</span>
                <span className="font-medium">{intervalLabels[interval] || interval}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut:</span>
                <Badge className={statusColors[status] || "bg-gray-500"}>
                  {statusLabels[status] || status}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Dates et contacts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date de début:</span>
                <span className="font-medium">{formatDate(new Date(startDate))}</span>
              </div>
              {endDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date de fin:</span>
                  <span className="font-medium">{formatDate(new Date(endDate))}</span>
                </div>
              )}
              {clientName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client:</span>
                  <span className="font-medium">{clientName}</span>
                </div>
              )}
              {freelancerName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Freelance:</span>
                  <span className="font-medium">{freelancerName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionData;
