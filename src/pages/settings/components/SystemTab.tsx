
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Database, Users, ShieldCheck } from "lucide-react";
import TestConnectionButton from "@/components/settings/TestConnectionButton";
import TestUserAccess from "@/components/settings/TestUserAccess";
import UserRoleTestMatrix from "@/components/settings/UserRoleTestMatrix";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SystemTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Maintenance système
          </CardTitle>
          <CardDescription>
            Opérations de maintenance et tests de connexion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-4 bg-amber-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              Les opérations suivantes sont destinées à la maintenance du système et aux tests.
              Utilisez-les avec précaution.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="users">
            <TabsList className="mb-4">
              <TabsTrigger value="users">Utilisateurs de test</TabsTrigger>
              <TabsTrigger value="access">Tests d'accès</TabsTrigger>
              <TabsTrigger value="connectivity">Connectivité</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Gestion des utilisateurs de test
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Créez rapidement des utilisateurs de test pour vérifier les fonctionnalités de l'application.
                  Cette opération va créer :
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mb-4 space-y-1">
                  <li>20 comptes "freelancer" (freelancer1.adlabfactory@example.com, etc.)</li>
                  <li>20 comptes "chargé d'affaires" (charge1.adlabfactory@example.com, etc.)</li>
                  <li>4 comptes "administrateur" (talihi.mohamed@example.com, etc.)</li>
                  <li>1 compte "super admin" (bennouna.anis@example.com)</li>
                </ul>
                
                <div className="flex justify-end">
                  <TestConnectionButton />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="access" className="space-y-6">
              <TestUserAccess />
              <UserRoleTestMatrix />
            </TabsContent>
            
            <TabsContent value="connectivity">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Tests de connexion
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Vérifiez les connexions aux services externes et à la base de données.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Base de données</span>
                      <span className="text-green-600 text-sm">Connecté</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Dernière vérification : il y a quelques secondes</p>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Authentification</span>
                      <span className="text-green-600 text-sm">Disponible</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Dernière vérification : il y a quelques secondes</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemTab;
