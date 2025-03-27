
import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderIcon, FolderOpenIcon, ArchiveIcon, StarIcon } from 'lucide-react';

interface QuoteFolderFilterProps {
  selectedFolder: string;
  onFolderChange: (folder: string) => void;
}

const QuoteFolderFilter: React.FC<QuoteFolderFilterProps> = ({
  selectedFolder,
  onFolderChange
}) => {
  const folders = [
    { id: 'all', label: 'Tous', icon: FolderOpenIcon },
    { id: 'general', label: 'Général', icon: FolderIcon },
    { id: 'important', label: 'Important', icon: StarIcon },
    { id: 'archive', label: 'Archive', icon: ArchiveIcon }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {folders.map((folder) => {
        const Icon = folder.icon;
        return (
          <Button
            key={folder.id}
            variant={selectedFolder === folder.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFolderChange(folder.id)}
            className="flex items-center gap-1"
          >
            <Icon className="h-4 w-4" />
            <span>{folder.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default QuoteFolderFilter;
