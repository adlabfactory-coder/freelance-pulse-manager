
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, AlertCircle } from 'lucide-react';

interface SidebarToggleProps {
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
  sidebarVisible: boolean;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ 
  toggleSidebar, 
  sidebarCollapsed, 
  sidebarVisible 
}) => {
  if (sidebarVisible) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? "Afficher le menu" : "Masquer le menu"}
        className="mr-2"
      >
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="mr-2 cursor-not-allowed opacity-50"
      title="La barre latérale n'est pas disponible"
    >
      <AlertCircle className="h-5 w-5 text-amber-500" />
    </Button>
  );
};

export default SidebarToggle;
