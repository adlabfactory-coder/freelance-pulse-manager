
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert } from "lucide-react";
import { PermissionCategory, RolePermission, UserRole, USER_ROLE_LABELS } from "@/types/roles";

interface PermissionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPermission: RolePermission | null;
  setEditingPermission: (permission: RolePermission | null) => void;
  onSave: () => void;
  allCategories: PermissionCategory[];
}

const PermissionEditDialog: React.FC<PermissionEditDialogProps> = ({
  open,
  onOpenChange,
  editingPermission,
  setEditingPermission,
  onSave,
  allCategories,
}) => {
  if (!editingPermission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la permission</DialogTitle>
          <DialogDescription>
            Définissez les rôles qui ont accès à cette permission
          </DialogDescription>
        </DialogHeader>
        
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
            <Label htmlFor="category">Catégorie</Label>
            <Select 
              value={editingPermission.category} 
              onValueChange={(value) => setEditingPermission({
                ...editingPermission, 
                category: value as PermissionCategory
              })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Rôles avec cette permission</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.values(UserRole).map((role) => (
                <Button
                  key={role}
                  type="button"
                  variant={editingPermission.roles.includes(role) || role === UserRole.SUPER_ADMIN ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (role === UserRole.SUPER_ADMIN) return; // Super Admin a toujours toutes les permissions
                    
                    const updatedRoles = editingPermission.roles.includes(role)
                      ? editingPermission.roles.filter(r => r !== role)
                      : [...editingPermission.roles, role];
                    setEditingPermission({...editingPermission, roles: updatedRoles});
                  }}
                  disabled={role === UserRole.SUPER_ADMIN} // Super Admin a toujours toutes les permissions
                  className={role === UserRole.SUPER_ADMIN ? "border-amber-500 text-amber-700" : ""}
                >
                  {role === UserRole.SUPER_ADMIN && <ShieldAlert className="mr-2 h-3 w-3 text-amber-500" />}
                  {USER_ROLE_LABELS[role]}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSave}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionEditDialog;
