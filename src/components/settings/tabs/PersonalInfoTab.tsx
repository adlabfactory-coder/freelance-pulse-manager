
import React from "react";
import { UserRole } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalInfoTabProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  canEdit: boolean;
  isCurrentUser: boolean;
  currentUserRole: UserRole;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  name,
  setName,
  email,
  setEmail,
  role,
  setRole,
  canEdit,
  isCurrentUser,
  currentUserRole,
  isSubmitting,
  onSubmit
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>
          Modifiez les informations personnelles et le rôle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              disabled={!canEdit}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={!canEdit}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <Select 
            value={role} 
            onValueChange={(value) => setRole(value as UserRole)}
            disabled={!canEdit || (isCurrentUser && currentUserRole === UserRole.ADMIN)}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Sélectionnez un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.ADMIN}>Administrateur</SelectItem>
              <SelectItem value={UserRole.FREELANCER}>Freelancer</SelectItem>
              <SelectItem value={UserRole.ACCOUNT_MANAGER}>Chargé(e) d'affaires</SelectItem>
              <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        {canEdit && (
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PersonalInfoTab;
