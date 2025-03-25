
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ServicesHeaderProps {
  onAddService: () => void;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ onAddService }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Services et Packs</h2>
      <Button onClick={onAddService}>
        <Plus className="mr-2 h-4 w-4" /> Ajouter un service
      </Button>
    </div>
  );
};

export default ServicesHeader;
