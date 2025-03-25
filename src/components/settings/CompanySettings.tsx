
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const CompanySettings: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    setIsSubmitting(true);
    // Simulation d'un appel API
    setTimeout(() => {
      toast({
        title: "Paramètres enregistrés",
        description: "Les informations de l'entreprise ont été mises à jour.",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de l'entreprise</CardTitle>
        <CardDescription>
          Modifiez les informations de votre entreprise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nom de l'entreprise</Label>
            <Input id="company-name" defaultValue="FreelancePulse" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-website">Site web</Label>
            <Input
              id="company-website"
              defaultValue="https://www.example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-address">Adresse</Label>
          <Input
            id="company-address"
            defaultValue="123 Rue du Commerce, 75001 Paris"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-phone">Téléphone</Label>
            <Input id="company-phone" defaultValue="+33 1 23 45 67 89" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-email">Email</Label>
            <Input
              id="company-email"
              type="email"
              defaultValue="contact@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-vat">Numéro de TVA</Label>
          <Input id="company-vat" defaultValue="FR12345678901" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Annuler</Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanySettings;
