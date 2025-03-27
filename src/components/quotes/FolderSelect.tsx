
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { FolderIcon } from 'lucide-react';

interface FolderSelectProps {
  value: string;
  onChange: (value: string) => void;
  folders?: string[];
  className?: string;
  placeholder?: string;
}

const defaultFolders = ['general', 'important', 'archive'];

const FolderSelect: React.FC<FolderSelectProps> = ({
  value,
  onChange,
  folders = defaultFolders,
  className = '',
  placeholder = 'Sélectionner un dossier'
}) => {
  return (
    <Select 
      value={value} 
      onValueChange={onChange}
    >
      <SelectTrigger className={`w-full ${className}`}>
        <div className="flex items-center gap-2">
          <FolderIcon className="h-4 w-4" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {folders.map((folder) => (
          <SelectItem key={folder} value={folder}>
            {folder.charAt(0).toUpperCase() + folder.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FolderSelect;
