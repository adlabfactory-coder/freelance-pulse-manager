
import React, { useState } from "react";
import { User } from '@/types';
import { UserRole } from '@/types/roles';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onDelete?: () => Promise<void>; // Make onDelete optional
  canDelete?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, onDelete, canDelete = false }) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState<UserRole>(user.role as UserRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const updatedUser = {
        ...user,
        name,
        email,
        role,
      };
      
      onUpdate(updatedUser);
      
      toast({
        title: "Utilisateur mis à jour",
        description: "Les modifications ont été enregistrées avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'utilisateur."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom complet"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select 
              value={role} 
              onValueChange={(value: UserRole) => setRole(value)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.ADMIN}>Administrateur</SelectItem>
                <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                <SelectItem value={UserRole.FREELANCER}>Freelance</SelectItem>
                <SelectItem value={UserRole.ACCOUNT_MANAGER}>Chargé d'affaires</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : "Enregistrer les modifications"}
            </Button>
            
            {canDelete && onDelete && (
              showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Suppression...
                      </>
                    ) : "Confirmer la suppression"}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              )
            )}
          </div>
        </form>
        
        {showDeleteConfirm && !canDelete && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              La suppression de ce compte n'est pas autorisée.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
