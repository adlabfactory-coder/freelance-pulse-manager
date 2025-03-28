
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const CompanySettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de l'entreprise</CardTitle>
        <CardDescription>
          Vue d'ensemble des paramètres de l'application AdLab Hub
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">À propos d'AdLab Hub</h3>
          <p className="text-sm text-muted-foreground">
            AdLab Hub est une plateforme interne pour la gestion des prospects, le suivi des contrats
            et la gestion des commissions des freelances.
          </p>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Fonctionnalités principales</Label>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Gestion des contacts et prospects</li>
              <li>Planification et suivi des rendez-vous</li>
              <li>Création et suivi des devis</li>
              <li>Gestion des abonnements et contrats</li>
              <li>Calcul et suivi des commissions</li>
            </ul>
          </div>
          
          <div className="space-y-1">
            <Label>Rôles utilisateurs</Label>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Admin - Accès complet à toutes les fonctionnalités</li>
              <li>Super Admin - Configuration système et rapports avancés</li>
              <li>Chargé de compte - Gestion des clients et contrats</li>
              <li>Freelance - Gestion des prospects et commissions</li>
            </ul>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Paramètres supplémentaires</h3>
          <p className="text-sm text-muted-foreground">
            Pour modifier les paramètres spécifiques, accédez aux sections correspondantes dans 
            le menu de navigation des paramètres.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanySettings;
