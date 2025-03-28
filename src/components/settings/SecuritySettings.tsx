
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const SecuritySettings: React.FC = () => {
  const handleSave = () => {
    toast({
      title: "Paramètres de sécurité enregistrés",
      description: "Vos paramètres de sécurité ont été mis à jour avec succès."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de sécurité</CardTitle>
        <CardDescription>
          Configurez les options de sécurité de votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">
                Sécurisez votre compte avec une vérification supplémentaire
              </p>
            </div>
            <Switch id="two-factor" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <Input type="password" id="current-password" placeholder="Entrez votre mot de passe actuel" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input type="password" id="new-password" placeholder="Entrez un nouveau mot de passe" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmez le mot de passe</Label>
            <Input type="password" id="confirm-password" placeholder="Confirmez le nouveau mot de passe" />
          </div>

          <div className="pt-2">
            <Button onClick={handleSave}>Enregistrer les modifications</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
