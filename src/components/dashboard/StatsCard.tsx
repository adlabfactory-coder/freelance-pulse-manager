
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  trend?: "up" | "down" | "neutral";
  description?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  description,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>

        {(change !== undefined || description) && (
          <div className="mt-4 flex items-center text-sm">
            {change !== undefined && trend && (
              <div
                className={cn(
                  "flex items-center mr-2",
                  trend === "up" && "text-green-500",
                  trend === "down" && "text-red-500",
                  trend === "neutral" && "text-yellow-500"
                )}
              >
                {trend === "up" && <ArrowUp className="h-4 w-4 mr-1" />}
                {trend === "down" && <ArrowDown className="h-4 w-4 mr-1" />}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
