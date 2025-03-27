
import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStatePanelProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const EmptyStatePanel: React.FC<EmptyStatePanelProps> = ({
  icon: Icon,
  title,
  description
}) => {
  return (
    <div className="bg-muted/50 p-8 rounded-lg flex items-center justify-center h-64">
      <div className="text-center">
        <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default EmptyStatePanel;
