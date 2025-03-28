
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecuritySettingsProps {
  isCurrentUser?: boolean;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ isCurrentUser = false }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const evaluatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = 
      [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (password.length < 8) {
      setPasswordStrength("weak");
    } else if (strength < 3) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    evaluatePasswordStrength(value);
  };

  const handleChangePassword = () => {
    setError(null);
    
    if (!currentPassword) {
      setError("Le mot de passe actuel est requis.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setIsSubmitting(true);

    // Simulation d'une requête API
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength(null);
      
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité du compte</CardTitle>
        <CardDescription>
          Gérez vos paramètres de sécurité et modifiez votre mot de passe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="current-password">Mot de passe actuel</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">Nouveau mot de passe</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          
          {passwordStrength && (
            <div className="mt-1">
              <div className="flex items-center space-x-2">
                <div className="h-2 flex-1 rounded-full bg-gray-200 overflow-hidden">
                  <div 
                    className={`h-full ${
                      passwordStrength === "weak" ? "w-1/3 bg-red-500" : 
                      passwordStrength === "medium" ? "w-2/3 bg-yellow-500" : 
                      "w-full bg-green-500"
                    }`}
                  />
                </div>
                <span className="text-sm">
                  {passwordStrength === "weak" ? "Faible" : 
                   passwordStrength === "medium" ? "Moyen" : 
                   "Fort"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full md:w-auto" 
          onClick={handleChangePassword}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Modification en cours..." : "Modifier le mot de passe"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SecuritySettings;
