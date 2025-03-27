
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, UserRole } from "@/types";
import { Edit, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { USER_ROLE_LABELS } from "@/types/roles";
import { useToast } from "@/hooks/use-toast";
import { updateUser } from "@/services/user/update-user";

interface UserProfileProps {
  user: User;
  onUpdate?: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const { isSuperAdmin, user: currentUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role as UserRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Déterminer si l'utilisateur courant peut modifier cet utilisateur
  const canEdit = currentUser?.id === user.id || isSuperAdmin;
  
  // Obtenir les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role as UserRole);
    setEditing(false);
  };
  
  const handleSubmit = async () => {
    if (!canEdit) return;
    
    setIsSubmitting(true);
    try {
      const success = await updateUser(user.id, {
        name,
        email,
        role
      });
      
      if (success) {
        const updatedUser = { ...user, name, email, role };
        toast({
          title: "Profil mis à jour",
          description: "Les informations ont été enregistrées avec succès."
        });
        setEditing(false);
        // Mettre à jour le parent si nécessaire
        if (onUpdate) {
          onUpdate(updatedUser);
        }
      } else {
        throw new Error("Impossible de mettre à jour le profil");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="flex justify-between items-center">
          <span>Informations du profil</span>
          {canEdit && !editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
          {editing && (
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-1" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Informations personnelles et paramètres de l'utilisateur
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{USER_ROLE_LABELS[user.role as UserRole] || user.role}</p>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            {editing ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                {isSuperAdmin && (
                  <div className="grid gap-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select 
                      value={role} 
                      onValueChange={(value) => setRole(value as UserRole)}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.ACCOUNT_MANAGER}>Chargé de compte</SelectItem>
                        <SelectItem value={UserRole.FREELANCER}>Freelance</SelectItem>
                        <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nom</p>
                    <p className="text-base">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                    <p className="text-base">{USER_ROLE_LABELS[user.role as UserRole] || user.role}</p>
                  </div>
                  {user.supervisor_id && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Superviseur</p>
                      <p className="text-base">ID: {user.supervisor_id}</p>
                    </div>
                  )}
                </div>
                {user.calendly_enabled && (
                  <div className="mt-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Calendly</p>
                      <p className="text-base">Activé</p>
                    </div>
                    {user.calendly_url && (
                      <div className="mt-1">
                        <a
                          href={user.calendly_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {user.calendly_url}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
