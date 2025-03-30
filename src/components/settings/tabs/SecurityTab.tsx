
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { updateUserPassword } from "@/services/user-service";
import { Loader2 } from "lucide-react";

interface SecurityTabProps {
  isCurrentUser: boolean;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ isCurrentUser }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas", {
        description: "Le nouveau mot de passe et sa confirmation doivent être identiques."
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Mot de passe trop court", {
        description: "Le mot de passe doit contenir au moins 8 caractères."
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Mise à jour du mot de passe en utilisant le nouveau service
      if (user && user.id) {
        const success = await updateUserPassword(user.id, newPassword);
        
        if (success) {
          toast.success("Mot de passe mis à jour", {
            description: "Votre mot de passe a été modifié avec succès."
          });
          
          // Réinitialiser les champs
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          toast.error("Échec de la mise à jour", {
            description: "Impossible de modifier le mot de passe. Veuillez réessayer."
          });
        }
      } else {
        toast.error("Utilisateur non connecté", {
          description: "Vous devez être connecté pour modifier votre mot de passe."
        });
      }
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      toast.error("Erreur", {
        description: "Impossible de modifier le mot de passe."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité du compte</CardTitle>
        <CardDescription>Modifiez votre mot de passe et les paramètres de sécurité</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={!isCurrentUser}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={!isCurrentUser}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={!isCurrentUser}
            />
          </div>
          
          <Button type="submit" disabled={isSubmitting || !isCurrentUser}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Mettre à jour le mot de passe"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="text-sm text-muted-foreground mt-4">
          <p className="font-medium">Remarque sur la sécurité:</p>
          <p>Utilisez un mot de passe fort avec au moins 8 caractères, incluant des majuscules, minuscules, chiffres et caractères spéciaux.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SecurityTab;
