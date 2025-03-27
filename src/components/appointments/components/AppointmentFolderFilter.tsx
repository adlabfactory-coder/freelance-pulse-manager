
import React from "react";
import { FOLDER_OPTIONS } from "./FolderSelect";
import { Button } from "@/components/ui/button";
import { Check, Filter, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface AppointmentFolderFilterProps {
  selectedFolder: string | null;
  onFolderChange: (folder: string | null) => void;
}

const AppointmentFolderFilter: React.FC<AppointmentFolderFilterProps> = ({
  selectedFolder,
  onFolderChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <Filter className="mr-2 h-4 w-4" />
          Dossier
          {selectedFolder && (
            <span className="ml-2 rounded-full bg-primary text-primary-foreground px-1 py-0.5 text-xs">
              {FOLDER_OPTIONS.find(f => f.value === selectedFolder)?.label || selectedFolder}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup
          value={selectedFolder || ""}
          onValueChange={(value) => onFolderChange(value || null)}
        >
          <DropdownMenuRadioItem value="">
            <Check
              className={`mr-2 h-4 w-4 ${!selectedFolder ? "opacity-100" : "opacity-0"}`}
            />
            Tous les dossiers
          </DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          {FOLDER_OPTIONS.map((folder) => (
            <DropdownMenuRadioItem key={folder.value} value={folder.value}>
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedFolder === folder.value ? "opacity-100" : "opacity-0"
                }`}
              />
              {folder.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {selectedFolder && (
          <>
            <DropdownMenuSeparator />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => onFolderChange(null)}
            >
              <X className="mr-2 h-4 w-4" />
              Effacer le filtre
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppointmentFolderFilter;
