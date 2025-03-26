
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserRole, USER_ROLE_LABELS } from "@/types/roles";
import { Navigate } from "react-router-dom";
import { Edit, UserPlus, Trash2, BarChart, Shield, User, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "@/components/ui/use-toast";
import { auditCreate, auditDelete, auditPermissionsChange, auditUpdate } from "@/services/audit-service";

// Données factices pour l'exemple
const mockUsers = [
  {
    id: "1",
    name: "Admin Démo",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    avatar: null,
    calendly_enabled: true,
    calendly_url: "https://calendly.com/admin-demo",
    calendly_sync_email: "admin@example.com"
  },
  {
    id: "2",
    name: "Commercial Démo",
    email: "commercial@example.com",
    role: UserRole.FREELANCER,
    avatar: null,
    calendly_enabled: true,
    calendly_url: "https://calendly.com/commercial-demo",
    calendly_sync_email: "commercial@example.com"
  },
  {
    id: "3",
    name: "Client Démo",
    email: "client@example.com",
    role: UserRole.CLIENT,
    avatar: null,
    calendly_enabled: false,
    calendly_url: "",
    calendly_sync_email: ""
  },
  {
    id: "4",
    name: "Super Admin Démo",
    email: "superadmin@example.com",
    role: UserRole.SUPER_ADMIN,
    avatar: null,
    calendly_enabled: true,
    calendly_url: "https://calendly.com/superadmin-demo",
    calendly_sync_email: "superadmin@example.com"
  },
  {
    id: "5",
    name: "Chargé de Compte Démo",
    email: "account@example.com",
    role: UserRole.ACCOUNT_MANAGER,
    avatar: null,
    calendly_enabled: true,
    calendly_url: "https://calendly.com/account-demo",
    calendly_sync_email: "account@example.com"
  }
];

// Type pour le formulaire utilisateur
interface UserFormData {
  id?: string;
  name: string;
  email: string;
  role: UserRole | string;
  calendly_enabled: boolean;
  calendly_url: string;
  calendly_sync_email: string;
}

const AdminPage: React.FC = () => {
  const { isSuperAdmin, user } = useAuth();
  const supabase = useSupabase();
  const [users, setUsers] = useState(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("tous");
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserFormData | null>(null);
  const [newUser, setNewUser] = useState<UserFormData>({
    name: "",
    email: "",
    role: UserRole.CLIENT,
    calendly_enabled: false,
    calendly_url: "",
    calendly_sync_email: ""
  });
  
  // Rediriger si l'utilisateur n'est pas un super admin
  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Filtrer les utilisateurs en fonction de l'onglet sélectionné
  const filteredUsers = users.filter(user => {
    if (selectedTab === "tous") return true;
    if (selectedTab === "admins") return user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
    if (selectedTab === "freelancers") return user.role === UserRole.FREELANCER;
    if (selectedTab === "account-managers") return user.role === UserRole.ACCOUNT_MANAGER;
    if (selectedTab === "clients") return user.role === UserRole.CLIENT;
    return true;
  });
  
  const handleAddUser = async () => {
    setIsLoading(true);
    
    try {
      // Simuler l'ajout d'un utilisateur
      const newUserId = Math.random().toString(36).substring(7);
      const createdUser = {
        ...newUser,
        id: newUserId,
        avatar: null
      };
      
      // Mise à jour UI
      setUsers([...users, createdUser]);
      
      // En production, on utiliserait:
      // const result = await supabase.createUser(newUser);
      
      // Journal d'audit
      if (user) {
        auditCreate(
          user.id,
          user.role,
          'users',
          newUserId,
          { role: newUser.role, email: newUser.email }
        );
      }
      
      toast({
        title: "Utilisateur créé",
        description: `L'utilisateur ${newUser.name} a été créé avec succès.`
      });
      
      // Réinitialiser le formulaire
      setNewUser({
        name: "",
        email: "",
        role: UserRole.CLIENT,
        calendly_enabled: false,
        calendly_url: "",
        calendly_sync_email: ""
      });
      
      setUserDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur lors de la création",
        description: error.message || "Une erreur est survenue lors de la création de l'utilisateur."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditUser = async () => {
    if (!editUser) return;
    
    setIsLoading(true);
    
    try {
      // Simuler la modification d'un utilisateur
      const updatedUsers = users.map(u => 
        u.id === editUser.id ? {...u, ...editUser} : u
      );
      
      // Mise à jour UI
      setUsers(updatedUsers);
      
      // En production, on utiliserait:
      // const result = await supabase.updateUser(editUser);
      
      // Journal d'audit
      if (user && editUser.id) {
        auditUpdate(
          user.id,
          user.role,
          'users',
          editUser.id,
          { role: editUser.role, name: editUser.name }
        );
      }
      
      toast({
        title: "Utilisateur modifié",
        description: `L'utilisateur ${editUser.name} a été modifié avec succès.`
      });
      
      setEditUser(null);
      setUserDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur lors de la modification",
        description: error.message || "Une erreur est survenue lors de la modification de l'utilisateur."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    setIsLoading(true);
    
    try {
      // Simuler la suppression d'un utilisateur
      const updatedUsers = users.filter(u => u.id !== userId);
      
      // Mise à jour UI
      setUsers(updatedUsers);
      
      // En production, on utiliserait:
      // const result = await supabase.deleteUser(userId);
      
      // Journal d'audit
      if (user) {
        auditDelete(
          user.id,
          user.role,
          'users',
          userId,
          { action: 'permanent_delete' }
        );
      }
      
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès."
      });
      
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur lors de la suppression",
        description: error.message || "Une erreur est survenue lors de la suppression de l'utilisateur."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openEditDialog = (user: UserFormData) => {
    setEditUser({...user});
    setUserDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setEditUser(null);
    setUserDialogOpen(true);
  };
  
  const isCurrentUser = (userId: string) => {
    return user?.id === userId;
  };
  
  const getRoleBadge = (role: UserRole | string) => {
    const roleStyles: Record<string, string> = {
      [UserRole.SUPER_ADMIN]: 'bg-red-100 text-red-800',
      [UserRole.ADMIN]: 'bg-yellow-100 text-yellow-800',
      [UserRole.FREELANCER]: 'bg-green-100 text-green-800',
      [UserRole.ACCOUNT_MANAGER]: 'bg-blue-100 text-blue-800',
      [UserRole.CLIENT]: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={roleStyles[role] || 'bg-gray-100 text-gray-800'}>
        {USER_ROLE_LABELS[role as UserRole] || role}
      </Badge>
    );
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
          <p className="text-muted-foreground">
            Gestion des utilisateurs et des permissions
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList>
          <TabsTrigger value="tous">
            <Users className="mr-2 h-4 w-4" />
            Tous les utilisateurs
          </TabsTrigger>
          <TabsTrigger value="admins">
            <Shield className="mr-2 h-4 w-4" />
            Administrateurs
          </TabsTrigger>
          <TabsTrigger value="freelancers">
            <BarChart className="mr-2 h-4 w-4" />
            Freelances
          </TabsTrigger>
          <TabsTrigger value="account-managers">
            <User className="mr-2 h-4 w-4" />
            Chargés de compte
          </TabsTrigger>
          <TabsTrigger value="clients">
            <User className="mr-2 h-4 w-4" />
            Clients
          </TabsTrigger>
        </TabsList>
        
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              {selectedTab === "tous"
                ? "Tous les utilisateurs de l'application"
                : selectedTab === "admins"
                ? "Administrateurs et super administrateurs"
                : selectedTab === "freelancers"
                ? "Freelances et commerciaux"
                : selectedTab === "account-managers"
                ? "Chargés de compte"
                : "Clients de la plateforme"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Calendly</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.calendly_enabled ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Activé
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Désactivé
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isCurrentUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmation de suppression</DialogTitle>
                              <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer l'utilisateur {user.name} ? Cette action est irréversible.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Annuler
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? "Suppression..." : "Supprimer"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
      
      {/* Dialog pour ajouter/éditer un utilisateur */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </DialogTitle>
            <DialogDescription>
              {editUser
                ? "Modifiez les informations de l'utilisateur ci-dessous."
                : "Remplissez le formulaire pour créer un nouvel utilisateur."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={editUser ? editUser.name : newUser.name}
                onChange={(e) => {
                  if (editUser) {
                    setEditUser({...editUser, name: e.target.value});
                  } else {
                    setNewUser({...newUser, name: e.target.value});
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editUser ? editUser.email : newUser.email}
                onChange={(e) => {
                  if (editUser) {
                    setEditUser({...editUser, email: e.target.value});
                  } else {
                    setNewUser({...newUser, email: e.target.value});
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={editUser ? editUser.role.toString() : newUser.role.toString()}
                onValueChange={(value) => {
                  if (editUser) {
                    setEditUser({...editUser, role: value});
                  } else {
                    setNewUser({...newUser, role: value});
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.CLIENT}>{USER_ROLE_LABELS[UserRole.CLIENT]}</SelectItem>
                  <SelectItem value={UserRole.FREELANCER}>{USER_ROLE_LABELS[UserRole.FREELANCER]}</SelectItem>
                  <SelectItem value={UserRole.ACCOUNT_MANAGER}>{USER_ROLE_LABELS[UserRole.ACCOUNT_MANAGER]}</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>{USER_ROLE_LABELS[UserRole.ADMIN]}</SelectItem>
                  <SelectItem value={UserRole.SUPER_ADMIN}>{USER_ROLE_LABELS[UserRole.SUPER_ADMIN]}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="calendly_enabled">Calendly</Label>
              <Select
                value={editUser 
                  ? editUser.calendly_enabled ? "true" : "false"
                  : newUser.calendly_enabled ? "true" : "false"
                }
                onValueChange={(value) => {
                  const enabled = value === "true";
                  if (editUser) {
                    setEditUser({...editUser, calendly_enabled: enabled});
                  } else {
                    setNewUser({...newUser, calendly_enabled: enabled});
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Activer Calendly" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activé</SelectItem>
                  <SelectItem value="false">Désactivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(editUser ? editUser.calendly_enabled : newUser.calendly_enabled) && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="calendly_url">URL Calendly</Label>
                  <Input
                    id="calendly_url"
                    value={editUser ? editUser.calendly_url : newUser.calendly_url}
                    onChange={(e) => {
                      if (editUser) {
                        setEditUser({...editUser, calendly_url: e.target.value});
                      } else {
                        setNewUser({...newUser, calendly_url: e.target.value});
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="calendly_sync_email">Email de synchronisation Calendly</Label>
                  <Input
                    id="calendly_sync_email"
                    value={editUser ? editUser.calendly_sync_email : newUser.calendly_sync_email}
                    onChange={(e) => {
                      if (editUser) {
                        setEditUser({...editUser, calendly_sync_email: e.target.value});
                      } else {
                        setNewUser({...newUser, calendly_sync_email: e.target.value});
                      }
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={editUser ? handleEditUser : handleAddUser}
              disabled={isLoading}
            >
              {isLoading 
                ? (editUser ? "Modification..." : "Création...") 
                : (editUser ? "Modifier" : "Créer")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
