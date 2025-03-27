
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Download, PieChart } from "lucide-react";
import { useCommissions } from "@/hooks/commission";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import CommissionsBarChart from "@/components/reports/CommissionsBarChart";
import RevenueChart from "@/components/reports/RevenueChart";
import SubscriptionsChart from "@/components/reports/SubscriptionsChart";
import RenewalRateChart from "@/components/reports/RenewalRateChart";

const Reports: React.FC = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const { commissions, loading: commissionsLoading } = useCommissions();
  const { subscriptions, loading: subscriptionsLoading } = useSubscriptions();
  
  // Limite à un seul chargement
  useEffect(() => {
    if (!dataLoaded) {
      console.log("Chargement initial des rapports");
      // Ici, vous pouvez ajouter des chargements de données si nécessaire
      setDataLoaded(true);
    }
  }, [dataLoaded]);

  const loading = commissionsLoading || subscriptionsLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
          <p className="text-muted-foreground mt-1">
            Visualisez vos données commerciales
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Télécharger
        </Button>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contrats signés</CardTitle>
                <CardDescription>
                  Evolution sur les 6 derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <BarChart className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="text-muted-foreground">
                  Les graphiques seront disponibles dans une prochaine version
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taux de conversion des devis</CardTitle>
                <CardDescription>
                  Pourcentage des devis convertis en ventes
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <PieChart className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="text-muted-foreground">
                  Les graphiques seront disponibles dans une prochaine version
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Performance des commerciaux</CardTitle>
                <CardDescription>
                  Comparaison des performances de l'équipe
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <BarChart className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="text-muted-foreground">
                  Les graphiques seront disponibles dans une prochaine version
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenus mensuels</CardTitle>
                <CardDescription>
                  Evolution des revenus sur les 12 derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Chargement des données...</p>
                  </div>
                ) : (
                  <RevenueChart />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des revenus</CardTitle>
                <CardDescription>
                  Par type de service et d'abonnement
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <PieChart className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="text-muted-foreground">
                  Les graphiques seront disponibles dans une prochaine version
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Commissions par commercial</CardTitle>
              <CardDescription>
                Montant des commissions versées par commercial
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] p-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Chargement des données...</p>
                </div>
              ) : (
                <CommissionsBarChart commissions={commissions} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Abonnements actifs</CardTitle>
                <CardDescription>
                  Répartition par type d'abonnement
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Chargement des données...</p>
                  </div>
                ) : (
                  <SubscriptionsChart subscriptions={subscriptions} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taux de renouvellement</CardTitle>
                <CardDescription>
                  Pourcentage de renouvellement des abonnements
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Chargement des données...</p>
                  </div>
                ) : (
                  <RenewalRateChart subscriptions={subscriptions} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
