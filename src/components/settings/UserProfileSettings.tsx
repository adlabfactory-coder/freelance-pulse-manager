
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, Pencil, User, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { User as UserType } from "@/types";
import { UserRole } from "@/types/roles";

interface UserProfileSettingsProps {
  currentUser: UserType | null;
}

const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [role, setRole] = useState(currentUser?.role || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dans un cas réel, appeler l'API pour mettre à jour l'utilisateur
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès"
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Réinitialiser les valeurs
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
    setRole(currentUser?.role || "");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Profil utilisateur</CardTitle>
          <CardDescription>
            Gérez les informations de votre profil
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
          disabled={isSubmitting}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentUser?.avatar || ""} alt={currentUser?.name || "Utilisateur"} />
              <AvatarFallback>
                <User className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            {isEditing ? (
              <Select value={role} onValueChange={setRole} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Administrateur</SelectItem>
                  <SelectItem value={UserRole.ACCOUNT_MANAGER}>Chargé de compte</SelectItem>
                  <SelectItem value={UserRole.FREELANCER}>Freelance</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="role"
                value={role === UserRole.ADMIN ? "Administrateur" : 
                      role === UserRole.ACCOUNT_MANAGER ? "Chargé de compte" : 
                      role === UserRole.FREELANCER ? "Freelance" : 
                      role === UserRole.SUPER_ADMIN ? "Super Admin" : role}
                readOnly
                className="bg-muted"
              />
            )}
          </div>
          
          {isEditing && (
            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </CardFooter>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileSettings;
