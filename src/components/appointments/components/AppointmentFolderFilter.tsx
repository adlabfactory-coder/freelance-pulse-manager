
import React from "react";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FOLDER_OPTIONS } from "./FolderSelect";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

interface AppointmentFolderFilterProps {
  selectedFolder: string | null;
  onFolderChange: (folder: string | null) => void;
}

const AppointmentFolderFilter: React.FC<AppointmentFolderFilterProps> = ({
  selectedFolder,
  onFolderChange
}) => {
  const handleSelectFolder = (folder: string) => {
    onFolderChange(selectedFolder === folder ? null : folder);
  };

  const getSelectedFolderLabel = () => {
    if (!selectedFolder) return "Tous les dossiers";
    const folder = FOLDER_OPTIONS.find(f => f.value === selectedFolder);
    return folder ? folder.label : "Dossier inconnu";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`flex items-center gap-2 ${selectedFolder ? 'bg-primary/10' : ''}`}
        >
          <Folder className="h-4 w-4" />
          <span>{getSelectedFolderLabel()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>Aucun dossier trouvé</CommandEmpty>
            <CommandGroup heading="Dossiers">
              <CommandItem
                onSelect={() => onFolderChange(null)}
                className={!selectedFolder ? 'bg-primary/10' : ''}
              >
                Tous les dossiers
              </CommandItem>
              {FOLDER_OPTIONS.map(folder => (
                <CommandItem
                  key={folder.value}
                  onSelect={() => handleSelectFolder(folder.value)}
                  className={selectedFolder === folder.value ? 'bg-primary/10' : ''}
                >
                  {folder.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AppointmentFolderFilter;
