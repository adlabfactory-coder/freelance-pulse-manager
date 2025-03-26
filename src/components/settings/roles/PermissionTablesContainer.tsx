
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserRole, RolePermission, PermissionCategory, USER_ROLE_LABELS } from "@/types/roles";
import { Edit, Shield } from "lucide-react";

interface PermissionTablesContainerProps {
  selectedCategory: PermissionCategory | "all";
  permissionsByCategory: Record<PermissionCategory, RolePermission[]>;
  filteredPermissions: RolePermission[];
  onToggleRole: (permission: RolePermission, role: UserRole) => void;
  onEditPermission: (permission: RolePermission) => void;
}

const PermissionTablesContainer: React.FC<PermissionTablesContainerProps> = ({
  selectedCategory,
  permissionsByCategory,
  filteredPermissions,
  onToggleRole,
  onEditPermission
}) => {
  if (filteredPermissions.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Aucune permission ne correspond aux critères sélectionnés.
      </div>
    );
  }

  // Si une catégorie spécifique est sélectionnée, n'afficher que cette catégorie
  if (selectedCategory !== "all") {
    const permissions = permissionsByCategory[selectedCategory] || [];
    
    return (
      <PermissionTable 
        category={selectedCategory} 
        permissions={permissions} 
        onToggleRole={onToggleRole}
        onEditPermission={onEditPermission}
      />
    );
  }

  // Sinon, afficher toutes les catégories avec leurs permissions
  return (
    <div className="space-y-8">
      {Object.entries(permissionsByCategory).map(([category, permissions]) => (
        <div key={category} className="rounded-md border">
          <div className="bg-muted/40 px-4 py-2 font-medium">
            {category}
          </div>
          <PermissionTable 
            category={category as PermissionCategory} 
            permissions={permissions} 
            onToggleRole={onToggleRole} 
            onEditPermission={onEditPermission}
          />
        </div>
      ))}
    </div>
  );
};

interface PermissionTableProps {
  category: PermissionCategory | string;
  permissions: RolePermission[];
  onToggleRole: (permission: RolePermission, role: UserRole) => void;
  onEditPermission: (permission: RolePermission) => void;
}

const PermissionTable: React.FC<PermissionTableProps> = ({
  category,
  permissions,
  onToggleRole,
  onEditPermission
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Permission</TableHead>
          <TableHead>Description</TableHead>
          {Object.values(UserRole).map(role => (
            <TableHead key={role} className="text-center">{USER_ROLE_LABELS[role]}</TableHead>
          ))}
          <TableHead className="w-[100px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.map(permission => (
          <TableRow key={permission.id}>
            <TableCell className="font-medium">{permission.name}</TableCell>
            <TableCell className="text-muted-foreground">{permission.description}</TableCell>
            {Object.values(UserRole).map(role => (
              <TableCell key={role} className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={
                    permission.roles.includes(role)
                      ? "bg-primary/20 hover:bg-primary/30 text-primary"
                      : "text-muted-foreground"
                  }
                  onClick={() => onToggleRole(permission, role)}
                  disabled={role === UserRole.SUPER_ADMIN} // Le Super Admin a toujours toutes les permissions
                >
                  {role === UserRole.SUPER_ADMIN && <Shield className="h-4 w-4" />}
                  {permission.roles.includes(role) ? "✓" : "—"}
                </Button>
              </TableCell>
            ))}
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditPermission(permission)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Modifier</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PermissionTablesContainer;
