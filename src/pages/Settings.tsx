
import React from "react";
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
import { UserRole } from "@/types";

const Settings: React.FC = () => {
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: UserRole.ADMIN,
      createdAt: new Date(2023, 0, 15),
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: UserRole.FREELANCER,
      createdAt: new Date(2023, 1, 20),
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: UserRole.FREELANCER,
      createdAt: new Date(2023, 2, 10),
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: UserRole.FREELANCER,
      createdAt: new Date(2023, 3, 5),
    },
    {
      id: "5",
      name: "Alice Martin",
      email: "alice@example.com",
      role: UserRole.CLIENT,
      createdAt: new Date(2023, 4, 12),
    },
  ];

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les paramètres de votre compte et de l'application
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="company">Entreprise</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>
                Modifiez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue="+33 6 12 34 56 78" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Input id="role" disabled defaultValue="Administrateur" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button>Enregistrer</Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Modifiez votre mot de passe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    Confirmer le mot de passe
                  </Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button>Mettre à jour</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
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

        <TabsContent value="company" className="mt-6">
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

        <TabsContent value="commissions" className="mt-6">
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
      </Tabs>
    </div>
  );
};

export default Settings;
