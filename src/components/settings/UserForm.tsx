import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface UserFormProps {
  initialData?: {
    id?: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
  };
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ 
  initialData = { name: "", email: "", role: UserRole.CLIENT },
  isEditing = false
}) => {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [role, setRole] = useState<UserRole>(initialData.role || UserRole.CLIENT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isAdminOrSuperAdmin, isSuperAdmin, user } = useAuth();
  const supabase = useSupabase();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }
    
    // Vérification des droits
    if (!isAdminOrSuperAdmin) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits nécessaires pour effectuer cette action."
      });
      return;
    }
    
    // Vérification spéciale pour la modification des admins et super admins
    if ((role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) && !isSuperAdmin) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seul un Super Admin peut gérer les comptes administrateurs."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (isEditing && initialData.id) {
        // Mise à jour d'un utilisateur existant
        result = await supabase.updateUser({
          id: initialData.id,
          name,
          email,
          role
        });
      } else {
        // Création d'un nouvel utilisateur
        // Cette fonction doit être implémentée côté serveur pour créer un compte utilisateur complet
        result = await supabase.createUser({
          name,
          email,
          role,
          avatar: null
        });
      }
      
      if (result.success) {
        toast({
          title: "Succès",
          description: isEditing 
            ? "L'utilisateur a été mis à jour avec succès." 
            : "L'utilisateur a été créé avec succès."
        });
        navigate("/settings/users");
      } else {
        throw new Error(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue, veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Modifiez les informations de l'utilisateur" 
            : "Créez un nouvel utilisateur dans le système"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Entrez le nom complet"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Entrez l'adresse email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Rôle *</Label>
            <Select 
              value={role} 
              onValueChange={(value) => setRole(value as UserRole)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {isSuperAdmin && (
                  <>
                    <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  </>
                )}
                <SelectItem value={UserRole.FREELANCER}>Chargé(e) d'affaires</SelectItem>
                <SelectItem value={UserRole.ACCOUNT_MANAGER}>Chargé(e) de compte</SelectItem>
                <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/settings/users")}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? "Enregistrement..." 
              : isEditing 
                ? "Mettre à jour" 
                : "Créer l'utilisateur"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserForm;
