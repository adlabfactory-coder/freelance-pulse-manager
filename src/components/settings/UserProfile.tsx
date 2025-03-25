import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, User } from "@/types";
import CalendlySettings from "./CalendlySettings";

interface UserProfileProps {
  userId: string;
  currentUser: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, currentUser }) => {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.FREELANCER);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isCurrentUser = userId === currentUser.id;
  const canEdit = isCurrentUser || currentUser.role === UserRole.ADMIN;

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await supabase.fetchUserById(userId);
        if (userData) {
          setUser(userData);
          setName(userData.name);
          setEmail(userData.email);
          setRole(userData.role);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les informations de l'utilisateur.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, supabase]);

  const handleSubmit = async () => {
    if (!canEdit) return;
    
    setIsSubmitting(true);
    try {
      const success = await supabase.updateUser(userId, {
        name,
        email,
        role
      });

      if (success) {
        toast({
          title: "Profil mis à jour",
          description: "Les informations du profil ont été enregistrées avec succès.",
        });
        
        // Update local user data
        if (user) {
          setUser({
            ...user,
            name,
            email,
            role
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du profil.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement du profil...</div>;
  }

  if (!user) {
    return <div className="text-center py-8">Utilisateur non trouvé</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{isCurrentUser ? "Mon Profil" : `Profil de ${user.name}`}</h1>
        <p className="text-muted-foreground mt-1">
          {isCurrentUser 
            ? "Gérez vos informations personnelles et vos paramètres" 
            : "Gérez les informations et les paramètres de cet utilisateur"}
        </p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="personal">Informations Personnelles</TabsTrigger>
          <TabsTrigger value="calendly">Intégration Calendly</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
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
                  disabled={!canEdit || (isCurrentUser && currentUser.role === UserRole.ADMIN)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Administrateur</SelectItem>
                    <SelectItem value={UserRole.FREELANCER}>Commercial</SelectItem>
                    <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              {canEdit && (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="calendly" className="mt-6">
          <CalendlySettings 
            user={user}
            isCurrentUser={isCurrentUser}
            canEdit={canEdit}
          />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
