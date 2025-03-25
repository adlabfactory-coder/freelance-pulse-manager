
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const SubscriptionFilters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Dans une implémentation réelle, cette fonction déclencherait une recherche filtrée
  };
  
  const handleFilterClick = () => {
    // Cette fonction serait utilisée pour appliquer les filtres sélectionnés
    toast("Filtres appliqués", {
      description: "Les données ont été filtrées selon vos critères."
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center">
      <div className="relative w-full md:w-64">
        <Input 
          type="text" 
          placeholder="Rechercher..." 
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtrer
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuCheckboxItem
            checked={true}
            onCheckedChange={() => {
              handleFilterClick();
            }}
          >
            Abonnements actifs
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={false}
            onCheckedChange={() => {
              handleFilterClick();
            }}
          >
            Abonnements en attente
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={false}
            onCheckedChange={() => {
              handleFilterClick();
            }}
          >
            Abonnements expirés
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SubscriptionFilters;
