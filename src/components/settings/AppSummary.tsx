
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types/roles";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { 
  Users, Calendar, FileText, FileSpreadsheet, 
  BarChart, Settings, Shield, Layers 
} from "lucide-react";

const AppSummary: React.FC = () => {
  const { role } = useAuth();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fonctionnement d'AdLab Hub</CardTitle>
        <CardDescription>
          Résumé détaillé du fonctionnement de l'application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="roles">Rôles</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">À propos d'AdLab Hub</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                AdLab Hub est une plateforme de gestion interne pour l'interaction et le suivi des prospects,
                la gestion des commissions des freelances, et le suivi des signatures de contrat.
              </p>
            </div>
            
            <Separator />
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Fonctionnalités principales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Gestion des contacts et des prospects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Planification de rendez-vous</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Création et gestion de devis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-primary" />
                      <span>Suivi des abonnements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-primary" />
                      <span>Gestion des commissions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Administration</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Gestion des utilisateurs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      <span>Configuration des paliers de commission</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-primary" />
                      <span>Paramètres de l'agence</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="roles" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Super Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Rôle le plus élevé avec accès complet à toutes les fonctionnalités.
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Gestion des utilisateurs</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Configuration du système</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Audit et rapports</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Toutes les fonctionnalités administratives</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Accès à la plupart des fonctionnalités administratives.
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Gestion des utilisateurs</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Configuration des commissions</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span>Accès limité à l'audit</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Chargé de compte</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Gère les contacts et suit les contrats clients.
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Gestion des contacts</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Création de rendez-vous</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Gestion des devis</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      <span>Pas d'accès aux commissions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Freelance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Commerciaux indépendants gérant leurs contacts et commissions.
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Gestion des contacts</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Planification de rendez-vous</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Création de devis</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Suivi des commissions personnelles</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="workflow" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Processus commercial</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative border-l border-gray-200 ml-3">
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-background">
                      <span className="text-white text-xs">1</span>
                    </span>
                    <h3 className="font-medium">Création de contact</h3>
                    <p className="text-sm text-muted-foreground">
                      Ajout d'un nouveau prospect dans le système avec ses informations
                    </p>
                  </li>
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-background">
                      <span className="text-white text-xs">2</span>
                    </span>
                    <h3 className="font-medium">Planification de rendez-vous</h3>
                    <p className="text-sm text-muted-foreground">
                      Organisation d'un premier contact ou d'une démonstration
                    </p>
                  </li>
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-background">
                      <span className="text-white text-xs">3</span>
                    </span>
                    <h3 className="font-medium">Création d'un devis</h3>
                    <p className="text-sm text-muted-foreground">
                      Élaboration d'une proposition commerciale adaptée au prospect
                    </p>
                  </li>
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-background">
                      <span className="text-white text-xs">4</span>
                    </span>
                    <h3 className="font-medium">Signature du contrat</h3>
                    <p className="text-sm text-muted-foreground">
                      Conversion du prospect en client avec signature du devis
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-background">
                      <span className="text-white text-xs">5</span>
                    </span>
                    <h3 className="font-medium">Gestion des commissions</h3>
                    <p className="text-sm text-muted-foreground">
                      Attribution des commissions au freelance selon le palier applicable
                    </p>
                  </li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Système de commission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Les freelances bénéficient d'un système de commission par paliers basé sur le nombre de contrats signés.
                </p>
                <div className="grid gap-2 mb-4">
                  <div className="grid grid-cols-3 font-medium text-sm">
                    <span>Palier</span>
                    <span>Contrats</span>
                    <span>Commission</span>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <span>Bronze</span>
                    <span>1-5</span>
                    <span>5-15%</span>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <span>Argent</span>
                    <span>6-15</span>
                    <span>10-20%</span>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <span>Or</span>
                    <span>16-30</span>
                    <span>15-25%</span>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <span>Platine</span>
                    <span>31+</span>
                    <span>20-30%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Les commissions sont calculées mensuellement sur la base des contrats actifs.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppSummary;
