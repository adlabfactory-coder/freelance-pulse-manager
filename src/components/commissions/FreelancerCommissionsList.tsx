
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommissionStatus, CommissionTier, CommissionWithDetails } from "@/types/commissions";
import { formatCurrency, formatDate } from "@/utils/format";
import { Link } from "react-router-dom";

// Mock data for freelancer commissions
const getMockCommissions = (): CommissionWithDetails[] => {
  return [
    {
      id: "1",
      freelancerId: "2",
      freelancerName: "Commercial Démo",
      amount: 1500,
      tier: CommissionTier.TIER_2,
      periodStart: new Date("2023-01-01"),
      periodEnd: new Date("2023-01-31"),
      status: "pending" as CommissionStatus,
      paidDate: undefined,
      paymentRequested: true,
      subscriptionDetails: {
        name: "Pack Enterprise",
        clientId: "3",
        client: {
          name: "Client Démo"
        }
      }
    },
    {
      id: "2",
      freelancerId: "2",
      freelancerName: "Commercial Démo",
      amount: 2000,
      tier: CommissionTier.TIER_3,
      periodStart: new Date("2023-02-01"),
      periodEnd: new Date("2023-02-28"),
      status: "processing" as CommissionStatus,
      paidDate: undefined,
      paymentRequested: true,
      subscriptionDetails: {
        name: "Pack Premium",
        clientId: "3",
        client: {
          name: "Client Démo"
        }
      }
    }
  ];
};

interface FreelancerCommissionsListProps {
  freelancerId?: string;
}

const FreelancerCommissionsList: React.FC<FreelancerCommissionsListProps> = ({ 
  freelancerId 
}) => {
  // In a real app, this would fetch from the API based on freelancerId
  const commissions = getMockCommissions();
  
  // Filter commissions by freelancerId if provided
  const filteredCommissions = freelancerId 
    ? commissions.filter(comm => comm.freelancerId === freelancerId)
    : commissions;

  if (filteredCommissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucune commission trouvée.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commissions récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredCommissions.map(commission => (
            <Link 
              key={commission.id} 
              to={`/commissions/${commission.id}`} 
              className="block"
            >
              <div className="border rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">
                      {commission.subscriptionDetails?.name || "Commission"} 
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {commission.subscriptionDetails?.client?.name ? (
                        `Client: ${commission.subscriptionDetails.client.name}`
                      ) : "Client non spécifié"}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      commission.status === "paid" ? "default" : 
                      commission.status === "pending" ? "secondary" : 
                      commission.status === "processing" ? "outline" : 
                      "destructive"
                    }
                    className={
                      commission.status === "paid" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                      commission.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
                      commission.status === "processing" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
                      ""
                    }
                  >
                    {commission.status === "paid" ? "Payée" : 
                     commission.status === "pending" ? "En attente" : 
                     commission.status === "processing" ? "En traitement" : 
                     "Rejetée"}
                  </Badge>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">
                    {formatCurrency(commission.amount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(commission.periodStart)} - {formatDate(commission.periodEnd)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerCommissionsList;
