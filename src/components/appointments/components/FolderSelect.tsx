
import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

// Options de dossiers disponibles
export const FOLDER_OPTIONS = [
  { value: "general", label: "Général" },
  { value: "leads", label: "Prospects" },
  { value: "clients", label: "Clients" },
  { value: "projects", label: "Projets" },
  { value: "follow-up", label: "Suivi" }
];

interface FolderSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
}

const FolderSelect: React.FC<FolderSelectProps> = ({
  value,
  onChange,
  label = "Dossier",
  description
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1.5">
        <label className="text-sm font-medium leading-none">{label}</label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un dossier" />
        </SelectTrigger>
        <SelectContent>
          {FOLDER_OPTIONS.map((folder) => (
            <SelectItem key={folder.value} value={folder.value}>
              {folder.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FolderSelect;
