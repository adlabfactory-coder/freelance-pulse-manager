
import React from "react";
import { User, UserRole } from "@/types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { USER_ROLE_LABELS } from "@/types/roles";
import UserActions from "../UserActions";

interface UsersTableProps {
  users: User[];
  selectedUserId?: string;
  currentUserRole: UserRole;
  onUserClick: (user: User) => void;
  onUserUpdated: () => Promise<void>;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  selectedUserId,
  currentUserRole,
  onUserClick,
  onUserUpdated
}) => {
  return (
    <ScrollArea className="h-[calc(100vh-400px)] min-h-[300px]">
      <Table>
        <TableCaption>Tous les utilisateurs de votre application.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Superviseur</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const supervisor = user.supervisor_id 
              ? users.find(u => u.id === user.supervisor_id) 
              : undefined;
              
            return (
              <TableRow 
                key={user.id} 
                onClick={() => onUserClick(user)} 
                className={`cursor-pointer hover:bg-muted ${selectedUserId === user.id ? 'bg-muted' : ''}`}
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{USER_ROLE_LABELS[user.role as UserRole]}</TableCell>
                <TableCell>
                  {supervisor 
                    ? `${supervisor.name} (${USER_ROLE_LABELS[supervisor.role as UserRole]})` 
                    : "Aucun"}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <UserActions 
                    user={user} 
                    currentUserRole={currentUserRole}
                    onUserUpdated={() => onUserUpdated()}
                    supervisors={users.filter(u => u.id !== user.id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default UsersTable;
