import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash, UserCog } from "lucide-react";
import { UserRole, User } from "@/types";
import { useSupabase } from "@/hooks/use-supabase";
import UserSelector from "@/components/settings/UserSelector";
import UserProfile from "@/components/settings/UserProfile";
import { toast } from "@/components/ui/use-toast";

const Settings: React.FC = () => {
  const supabase = useSupabase();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .limit(1)
          .single();
        
        if (error) throw error;
        
        const user = {
          ...data,
          role: data.role as UserRole
        } as User;
        
        setCurrentUser(user);
        setSelectedUserId(user.id);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer vos informations utilisateur.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [supabase]);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return (
          <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
            Administrateur
          </span>
        );
      case UserRole.FREELANCER:
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Commercial
          </span>
        );
      case UserRole.CLIENT:
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            Client
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des paramètres...</div>;
  }

  if (!currentUser) {
    return <div className="text-center py-8">Impossible de charger les paramètres</div>;
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab("profile");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les paramètres de votre compte et de l'application
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <UserSelector 
            currentUser={currentUser} 
            onSelectUser={handleUserSelect} 
          />
          
          <Tabs 
            className="mt-6" 
            value={activeTab} 
            onValueChange={setActiveTab}
            orientation="vertical"
          >
            <TabsList className="flex flex-col w-full h-auto">
              <TabsTrigger value="profile" className="justify-start">Profil</TabsTrigger>
              <TabsTrigger value="users" className="justify-start">Utilisateurs</TabsTrigger>
              <TabsTrigger value="company" className="justify-start">Entreprise</TabsTrigger>
              <TabsTrigger value="commissions" className="justify-start">Commissions</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="md:col-span-3">
          <TabsContent value="profile" className="mt-0">
            {selectedUserId && (
              <UserProfile 
                userId={selectedUserId} 
                currentUser={currentUser} 
              />
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Ajouter un utilisateur
              </Button>
            </div>

            <div className="rounded-md border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Date de création
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <UserCog className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="company" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'entreprise</CardTitle>
                <CardDescription>
                  Modifiez les informations de votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nom de l'entreprise</Label>
                    <Input id="company-name" defaultValue="FreelancePulse" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-website">Site web</Label>
                    <Input
                      id="company-website"
                      defaultValue="https://www.example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-address">Adresse</Label>
                  <Input
                    id="company-address"
                    defaultValue="123 Rue du Commerce, 75001 Paris"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Téléphone</Label>
                    <Input id="company-phone" defaultValue="+33 1 23 45 67 89" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input
                      id="company-email"
                      type="email"
                      defaultValue="contact@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-vat">Numéro de TVA</Label>
                  <Input id="company-vat" defaultValue="FR12345678901" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Annuler</Button>
                <Button>Enregistrer</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="commissions" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Paliers de commission</CardTitle>
                <CardDescription>
                  Configurez les paliers de commission des commerciaux
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b pb-4">
                    <div>
                      <Label className="text-base">Palier 1 (Base)</Label>
                      <p className="text-sm text-muted-foreground">
                        0 contrats et plus
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tier1">Taux de commission (%)</Label>
                      <Input id="tier1" defaultValue="10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b pb-4">
                    <div>
                      <Label className="text-base">Palier 2</Label>
                      <p className="text-sm text-muted-foreground">
                        5 contrats et plus
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tier2">Taux de commission (%)</Label>
                      <Input id="tier2" defaultValue="15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tier2-min">Nombre min. de contrats</Label>
                      <Input id="tier2-min" defaultValue="5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b pb-4">
                    <div>
                      <Label className="text-base">Palier 3</Label>
                      <p className="text-sm text-muted-foreground">
                        10 contrats et plus
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tier3">Taux de commission (%)</Label>
                      <Input id="tier3" defaultValue="20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tier3-min">Nombre min. de contrats</Label>
                      <Input id="tier3-min" defaultValue="10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <Label className="text-base">Palier 4</Label>
                      <p className="text-sm text-muted-foreground">
                        20 contrats et plus
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tier4">Taux de commission (%)</Label>
                      <Input id="tier4" defaultValue="25" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tier4-min">Nombre min. de contrats</Label>
                      <Input id="tier4-min" defaultValue="20" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Annuler</Button>
                <Button>Enregistrer</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default Settings;
