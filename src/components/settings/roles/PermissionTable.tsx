
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PermissionCategory, ROLE_HIERARCHY, RolePermission, USER_ROLE_LABELS, UserRole } from "@/types/roles";

interface PermissionTableProps {
  category: PermissionCategory;
  permissions: RolePermission[];
  onToggleRole: (permission: RolePermission, role: UserRole) => void;
}

const PermissionTable: React.FC<PermissionTableProps> = ({ 
  category, 
  permissions,
  onToggleRole
}) => {
  return (
    <Table key={category}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Permission</TableHead>
          <TableHead className="w-[300px]">Description</TableHead>
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
                  onClick={() => onToggleRole(permission, role)}
                  disabled={role === UserRole.SUPER_ADMIN} // Super Admin a toujours toutes les permissions
                >
                  {permission.roles.includes(role) || role === UserRole.SUPER_ADMIN ? (
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
  );
};

export default PermissionTable;
