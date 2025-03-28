
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UsersHeaderProps {
  onRefresh: () => void;
}

const UsersHeader: React.FC<UsersHeaderProps> = ({ onRefresh }) => {
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate("/settings/users/create");
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="primary" 
        size="sm" 
        onClick={onRefresh}
        className="h-8 gap-1"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Actualiser
      </Button>
      <Button 
        size="sm" 
        onClick={handleAddUser}
        className="h-8 gap-1"
      >
        <UserPlus className="h-3.5 w-3.5" />
        Ajouter un utilisateur
      </Button>
    </div>
  );
};

export default UsersHeader;
