
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { PermissionCategory } from "@/types/roles";

interface PermissionFilterProps {
  selectedCategory: PermissionCategory | "all";
  setSelectedCategory: (category: PermissionCategory | "all") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  allCategories: PermissionCategory[];
}

const PermissionFilter: React.FC<PermissionFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  allCategories
}) => {
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as PermissionCategory | "all");
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="grid gap-4 mb-6 md:grid-cols-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="category-filter" className="w-24">Catégorie:</Label>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category-filter" className="flex-1">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {allCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <Label htmlFor="search-permissions" className="w-24">Rechercher:</Label>
        <div className="relative flex-1">
          <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-permissions"
            placeholder="Rechercher une permission..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PermissionFilter;
