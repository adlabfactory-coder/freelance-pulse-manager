
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole, USER_ROLE_LABELS, ROLE_HIERARCHY } from "@/types/roles";
import { Check, Info } from "lucide-react";

interface RolePermission {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
}

const DEFAULT_PERMISSIONS: RolePermission[] = [
  {
    id: "manage_users",
    name: "Gestion des utilisateurs",
    description: "Créer, modifier et supprimer des utilisateurs",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "manage_freelancers",
    name: "Gestion des freelances",
    description: "Ajouter et gérer des freelances",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "view_commissions",
    name: "Voir les commissions",
    description: "Consulter toutes les commissions",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER]
  },
  {
    id: "approve_commissions",
    name: "Approuver les commissions",
    description: "Approuver les demandes de paiement de commission",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "manage_services",
    name: "Gérer les services",
    description: "Ajouter, modifier et supprimer des services",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "database_access",
    name: "Accès base de données",
    description: "Accéder aux fonctionnalités avancées de la base de données",
    roles: [UserRole.SUPER_ADMIN]
  },
  {
    id: "manage_api_keys",
    name: "Gérer les clés API",
    description: "Créer et révoquer des clés API",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  }
];

const RoleManagement: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<RolePermission[]>(DEFAULT_PERMISSIONS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<RolePermission | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };
  
  const handleEditPermission = (permission: RolePermission) => {
    setEditingPermission({...permission});
    setDialogOpen(true);
  };
  
  const handleSavePermission = () => {
    if (editingPermission) {
      setPermissions(permissions.map(p => 
        p.id === editingPermission.id ? editingPermission : p
      ));
      setDialogOpen(false);
      setEditingPermission(null);
    }
  };
  
  const handleToggleRole = (permission: RolePermission, role: UserRole) => {
    const updatedPermission = {...permission};
    
    if (updatedPermission.roles.includes(role)) {
      // Ne pas permettre de retirer une permission au Super Admin
      if (role === UserRole.SUPER_ADMIN) {
        return;
      }
      updatedPermission.roles = updatedPermission.roles.filter(r => r !== role);
    } else {
      updatedPermission.roles = [...updatedPermission.roles, role];
    }
    
    setPermissions(permissions.map(p => 
      p.id === permission.id ? updatedPermission : p
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des rôles et permissions</CardTitle>
        <CardDescription>
          Configurez les permissions pour chaque rôle utilisateur
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Les modifications apportées à cette configuration s'appliquent à l'ensemble de l'application.
            Les utilisateurs Super Admin conservent toujours tous les droits pour des raisons de sécurité.
          </AlertDescription>
        </Alert>
        
        <div className="flex space-x-2 mb-6">
          {ROLE_HIERARCHY.map((role) => (
            <Button 
              key={role}
              variant={selectedRole === role ? "default" : "outline"} 
              onClick={() => handleRoleSelect(role)}
            >
              {USER_ROLE_LABELS[role]}
            </Button>
          ))}
        </div>
        
        <Table>
          <TableCaption>Liste des permissions par rôle</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Permission</TableHead>
              <TableHead>Description</TableHead>
              {ROLE_HIERARCHY.map((role) => (
                <TableHead key={role} className="text-center">
                  {USER_ROLE_LABELS[role]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell className="font-medium">{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                {ROLE_HIERARCHY.map((role) => (
                  <TableCell key={role} className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleToggleRole(permission, role)}
                      disabled={role === UserRole.SUPER_ADMIN} // Super Admin a toujours toutes les permissions
                    >
                      {permission.roles.includes(role) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                      )}
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la permission</DialogTitle>
            <DialogDescription>
              Définissez les rôles qui ont accès à cette permission
            </DialogDescription>
          </DialogHeader>
          
          {editingPermission && (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input 
                    id="name" 
                    value={editingPermission.name} 
                    onChange={(e) => setEditingPermission({...editingPermission, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    value={editingPermission.description} 
                    onChange={(e) => setEditingPermission({...editingPermission, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Rôles avec cette permission</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ROLE_HIERARCHY.map((role) => (
                      <Button
                        key={role}
                        type="button"
                        variant={editingPermission.roles.includes(role) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const updatedRoles = editingPermission.roles.includes(role)
                            ? editingPermission.roles.filter(r => r !== role)
                            : [...editingPermission.roles, role];
                          setEditingPermission({...editingPermission, roles: updatedRoles});
                        }}
                        disabled={role === UserRole.SUPER_ADMIN} // Super Admin a toujours toutes les permissions
                      >
                        {USER_ROLE_LABELS[role]}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSavePermission}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RoleManagement;
