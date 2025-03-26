
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommissionContent from "@/components/commissions/CommissionContent";
import { Commission } from "@/types/commissions";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AdminCommissionsContentProps {
  commissions: Commission[];
  commissionRules: any[];
  loading: boolean;
  requestingPayment: boolean;
  requestPayment: (commissionId: string) => void;
  approvePayment: (commissionId: string) => void;
  generateMonthlyCommissions: (month: Date) => void;
}

const AdminCommissionsContent: React.FC<AdminCommissionsContentProps> = ({
  commissions,
  commissionRules,
  loading,
  requestingPayment,
  requestPayment,
  approvePayment,
  generateMonthlyCommissions
}) => {
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);

  // Filtrer les commissions qui ont une demande de paiement en attente
  const pendingPaymentRequests = commissions.filter(
    commission => commission.paymentRequested && commission.status !== 'paid'
  );

  // Résumé des commissions par freelancer
  const commissionSummary = commissions.reduce((acc, commission) => {
    if (!acc[commission.freelancerId]) {
      acc[commission.freelancerId] = {
        freelancerId: commission.freelancerId,
        freelancerName: commission.freelancerName,
        totalCommissions: 0,
        paidCommissions: 0,
        pendingCommissions: 0,
      };
    }
    
    acc[commission.freelancerId].totalCommissions += commission.amount;
    
    if (commission.status === 'paid') {
      acc[commission.freelancerId].paidCommissions += commission.amount;
    } else {
      acc[commission.freelancerId].pendingCommissions += commission.amount;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const handleGenerate = async () => {
    if (!selectedMonth) return;
    
    setIsGenerating(true);
    try {
      await generateMonthlyCommissions(selectedMonth);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <Card className="w-full md:w-auto">
          <CardHeader className="pb-2">
            <CardTitle>Générer les commissions mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[240px] justify-start text-left font-normal",
                      !selectedMonth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedMonth ? (
                      format(selectedMonth, "MMMM yyyy", { locale: fr })
                    ) : (
                      "Sélectionner un mois"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedMonth}
                    onSelect={setSelectedMonth}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !selectedMonth}
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  "Générer les commissions"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-auto">
          <CardHeader className="pb-2">
            <CardTitle>Demandes de versement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPaymentRequests.length}</div>
            <p className="text-sm text-muted-foreground">
              {pendingPaymentRequests.length === 0 
                ? "Aucune demande en attente" 
                : pendingPaymentRequests.length === 1 
                  ? "1 demande en attente de validation" 
                  : `${pendingPaymentRequests.length} demandes en attente de validation`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toutes les commissions</TabsTrigger>
          <TabsTrigger value="pending">Demandes de versement</TabsTrigger>
          <TabsTrigger value="summary">Résumé par commercial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <CommissionContent
            commissions={commissions}
            commissionRules={commissionRules}
            loading={loading}
            requestingPayment={requestingPayment}
            requestPayment={requestPayment}
            approvePayment={approvePayment}
            isAdmin={true}
          />
        </TabsContent>
        
        <TabsContent value="pending">
          {pendingPaymentRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune demande de versement en attente</p>
            </div>
          ) : (
            <CommissionContent
              commissions={pendingPaymentRequests}
              commissionRules={commissionRules}
              loading={loading}
              requestingPayment={requestingPayment}
              requestPayment={requestPayment}
              approvePayment={approvePayment}
              isAdmin={true}
            />
          )}
        </TabsContent>
        
        <TabsContent value="summary">
          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left">Commercial</th>
                  <th className="p-3 text-right">Total commissions</th>
                  <th className="p-3 text-right">Commissions payées</th>
                  <th className="p-3 text-right">En attente</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(commissionSummary).map((summary: any) => (
                  <tr key={summary.freelancerId} className="border-b">
                    <td className="p-3">{summary.freelancerName}</td>
                    <td className="p-3 text-right">{new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(summary.totalCommissions)}</td>
                    <td className="p-3 text-right">{new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(summary.paidCommissions)}</td>
                    <td className="p-3 text-right">{new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(summary.pendingCommissions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCommissionsContent;
