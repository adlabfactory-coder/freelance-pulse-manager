
import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import StatsCard from "./StatsCard";

interface StatsCardWithTooltipProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  trend: "up" | "down" | "neutral";
  description: string;
  dataSource: string;
  lastUpdated?: Date;
  onClick?: () => void;
}

const StatsCardWithTooltip: React.FC<StatsCardWithTooltipProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  description,
  dataSource,
  lastUpdated,
  onClick,
}) => {
  return (
    <div className="relative group" onClick={onClick}>
      <StatsCard
        title={title}
        value={value}
        icon={icon}
        change={change}
        trend={trend}
        description={description}
      />
      
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Cliquer pour plus d'informations</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {lastUpdated && (
        <div className="absolute bottom-2 right-3 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          Mis à jour {lastUpdated.toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
      
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="absolute inset-0 cursor-pointer" />
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">{title} - Détails</h4>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Source:</span> {dataSource}</p>
              {lastUpdated && (
                <p><span className="font-medium">Dernière mise à jour:</span> {lastUpdated.toLocaleDateString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">Cliquez pour plus de détails</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default StatsCardWithTooltip;
