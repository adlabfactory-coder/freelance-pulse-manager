
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const CommissionSettings: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    setIsSubmitting(true);
    // Simulation d'un appel API
    setTimeout(() => {
      toast({
        title: "Paliers mis à jour",
        description: "Les paliers de commission ont été enregistrés avec succès.",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paliers de commission</CardTitle>
        <CardDescription>
          Configurez les paliers de commission des commerciaux
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b pb-4">
            <div>
              <Label className="text-base">Palier 1 (Base)</Label>
              <p className="text-sm text-muted-foreground">
                0 contrats et plus
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier1">Taux de commission (%)</Label>
              <Input id="tier1" defaultValue="10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b pb-4">
            <div>
              <Label className="text-base">Palier 2</Label>
              <p className="text-sm text-muted-foreground">
                5 contrats et plus
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier2">Taux de commission (%)</Label>
              <Input id="tier2" defaultValue="15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier2-min">Nombre min. de contrats</Label>
              <Input id="tier2-min" defaultValue="5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b pb-4">
            <div>
              <Label className="text-base">Palier 3</Label>
              <p className="text-sm text-muted-foreground">
                10 contrats et plus
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier3">Taux de commission (%)</Label>
              <Input id="tier3" defaultValue="20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier3-min">Nombre min. de contrats</Label>
              <Input id="tier3-min" defaultValue="10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <Label className="text-base">Palier 4</Label>
              <p className="text-sm text-muted-foreground">
                20 contrats et plus
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier4">Taux de commission (%)</Label>
              <Input id="tier4" defaultValue="25" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier4-min">Nombre min. de contrats</Label>
              <Input id="tier4-min" defaultValue="20" />
            </div>
          </div>
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

export default CommissionSettings;
