
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SecurityTabProps {
  isCurrentUser: boolean;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ isCurrentUser }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité</CardTitle>
        <CardDescription>Modifiez le mot de passe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Mot de passe actuel</Label>
          <Input id="current-password" type="password" disabled={!isCurrentUser} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input id="new-password" type="password" disabled={!isCurrentUser} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">
              Confirmer le mot de passe
            </Label>
            <Input id="confirm-password" type="password" disabled={!isCurrentUser} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isCurrentUser && (
          <Button>Mettre à jour</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SecurityTab;
