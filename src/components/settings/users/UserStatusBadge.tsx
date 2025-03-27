
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CircleIcon } from 'lucide-react';

interface UserStatusBadgeProps {
  isOnline: boolean;
}

const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ isOnline }) => {
  return (
    <Badge variant={isOnline ? "outline" : "secondary"} className={`flex items-center ${isOnline ? "border-green-500" : "bg-gray-200"}`}>
      <CircleIcon className={`h-2 w-2 mr-1 ${isOnline ? "text-green-500" : "text-gray-500"}`} />
      {isOnline ? "En ligne" : "Hors ligne"}
    </Badge>
  );
};

export default UserStatusBadge;
