
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types";
import { USER_ROLE_LABELS } from "@/types/roles";

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
  canEditRole?: boolean;
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
  onSubmit,
  canEditRole = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>
          {canEdit 
            ? "Modifiez vos informations personnelles ci-dessous" 
            : "Informations personnelles de l'utilisateur"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            disabled={!canEdit || isSubmitting}
            placeholder="Votre nom complet"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={!canEdit || isSubmitting}
            placeholder="votre.email@exemple.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          {canEdit && canEditRole ? (
            <Select 
              value={role} 
              onValueChange={(value) => setRole(value as UserRole)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((roleValue) => (
                  <SelectItem 
                    key={roleValue} 
                    value={roleValue}
                    disabled={
                      // Seul un super admin peut créer des super admin
                      (roleValue === UserRole.SUPER_ADMIN && currentUserRole !== UserRole.SUPER_ADMIN) ||
                      // Seul un super admin peut créer des admin
                      (roleValue === UserRole.ADMIN && currentUserRole !== UserRole.SUPER_ADMIN && currentUserRole !== UserRole.ADMIN)
                    }
                  >
                    {USER_ROLE_LABELS[roleValue as UserRole]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input 
              id="role" 
              value={USER_ROLE_LABELS[role] || role} 
              disabled 
              className="bg-muted"
            />
          )}
          {isCurrentUser && !canEditRole && (
            <p className="text-sm text-muted-foreground mt-1">
              Seuls les administrateurs peuvent modifier les rôles.
            </p>
          )}
        </div>
      </CardContent>
      
      {canEdit && (
        <CardFooter className="flex justify-end">
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PersonalInfoTab;
