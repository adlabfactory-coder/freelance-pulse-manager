
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Loader2, Shield, Upload } from "lucide-react";
import { toast } from "sonner";
import { User as UserType, UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useUserOperations } from "@/hooks/supabase/use-user-operations";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SuperAdminSettings: React.FC = () => {
  const { user: currentUser } = useAuth();
  const userOperations = useUserOperations();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || ""
      });
      
      setIsSuperAdmin(currentUser.role === UserRole.SUPER_ADMIN);
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      // Pour la prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !isSuperAdmin) return;
    
    setIsLoading(true);
    try {
      // Simulation de la mise à jour de l'avatar (dans un environnement réel, utilisez un service de stockage)
      let avatarUrl = formData.avatar;
      if (avatarFile) {
        // Simule un téléchargement
        await new Promise(r => setTimeout(r, 1000));
        avatarUrl = URL.createObjectURL(avatarFile);
      }
      
      // Mise à jour du profil utilisateur
      const updatedData = {
        id: currentUser.id,
        name: formData.name,
        email: formData.email,
        avatar: avatarUrl,
        role: UserRole.SUPER_ADMIN
      };
      
      const result = await userOperations.updateUserProfile(updatedData);
      
      if (result) {
        toast.success("Profil Super Admin mis à jour avec succès");
      } else {
        toast.error("La mise à jour du profil a échoué");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Une erreur est survenue lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paramètres Super Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription>
              Cette section est réservée uniquement aux Super Administrateurs.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Paramètres Super Admin</CardTitle>
        </div>
        <CardDescription>
          Gérez vos informations de compte Super Administrateur
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              {formData.avatar ? (
                <AvatarImage src={formData.avatar} alt="Avatar" />
              ) : (
                <AvatarFallback>
                  <User className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex items-center">
              <Label htmlFor="avatar" className="cursor-pointer flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md">
                <Upload className="h-4 w-4" />
                <span>Choisir un avatar</span>
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SuperAdminSettings;
